package Jorch.w3Lt.Jorge.service;

import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.webp.WebpWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

@Service
@Slf4j
public class MediaService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.webp.enabled:true}")
    private boolean webpEnabled;

    /**
     * Uploads a file, converts it to WebP and returns the relative URL.
     * 
     * @param file The file to upload
     * @return The URL of the uploaded file (e.g. /uploads/uuid.webp)
     * @throws IOException If the file cannot be stored
     */
    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file.");
        }

        String contentType = Objects.requireNonNullElse(file.getContentType(), "");
        if (!contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image uploads are supported.");
        }

        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "upload"));
        String baseName = originalFilename.contains(".") ? 
                originalFilename.substring(0, originalFilename.lastIndexOf('.')) : 
                originalFilename;
        String safeBaseName = sanitizeFileNameBase(baseName);
        String extension = determineSafeExtension(originalFilename, contentType);
        String originalFilenameSafe = UUID.randomUUID().toString() + "_" + safeBaseName + extension;
        Path originalTargetPath = root.resolve(originalFilenameSafe);

        if (!webpEnabled) {
            Files.copy(file.getInputStream(), originalTargetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + originalFilenameSafe;
        }

        String webpFilename = UUID.randomUUID().toString() + "_" + safeBaseName + ".webp";
        Path webpTargetPath = root.resolve(webpFilename);

        try {
            ImmutableImage image = ImmutableImage.loader().fromStream(file.getInputStream());
            image.output(WebpWriter.DEFAULT, webpTargetPath);
            return "/uploads/" + webpFilename;
        } catch (Throwable throwable) {
            log.warn("WebP conversion failed, falling back to original format upload: {}", originalFilename, throwable);
            Files.copy(file.getInputStream(), originalTargetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + originalFilenameSafe;
        }
    }

    private String sanitizeFileNameBase(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        String withoutDiacritics = normalized.replaceAll("\\p{M}+", "");
        String safe = withoutDiacritics
                .replaceAll("[^A-Za-z0-9._-]+", "-")
                .replaceAll("-{2,}", "-")
                .replaceAll("^[.-]+|[.-]+$", "")
                .toLowerCase(Locale.ROOT);

        return safe.isEmpty() ? "image" : safe;
    }

    private String determineSafeExtension(String originalFilename, String contentType) {
        String ext = StringUtils.getFilenameExtension(originalFilename);
        if (ext != null) {
            String safeExt = ext.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
            if (!safeExt.isEmpty()) {
                return "." + safeExt;
            }
        }

        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            case "image/svg+xml" -> ".svg";
            default -> ".img";
        };
    }

    /**
     * Deletes a file from the filesystem.
     * 
     * @param fileUrl The relative URL of the file
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            return;
        }

        String filename = fileUrl.replace("/uploads/", "");
        Path filePath = Paths.get(uploadDir).resolve(filename);

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Could not delete file: " + filePath + ". Error: " + e.getMessage());
        }
    }
}
