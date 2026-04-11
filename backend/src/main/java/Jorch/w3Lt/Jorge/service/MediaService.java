package Jorch.w3Lt.Jorge.service;

import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.webp.WebpWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

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

        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String baseName = originalFilename.contains(".") ? 
                originalFilename.substring(0, originalFilename.lastIndexOf('.')) : 
                originalFilename;
        
        // Always save as webp
        String filename = UUID.randomUUID().toString() + "_" + baseName + ".webp";
        Path targetPath = root.resolve(filename);

        try {
            // Convert to WebP using Scrimage
            // We use standard compression (lossy), which is usually perfect for web
            ImmutableImage image = ImmutableImage.loader().fromStream(file.getInputStream());
            
            // Resize if needed (optional: we could add a max width/height here)
            // image.max(1920, 1080).output(WebpWriter.DEFAULT, targetPath);
            
            image.output(WebpWriter.DEFAULT, targetPath);
        } catch (Exception e) {
            // Fallback if image processing fails (e.g. not an image)
            // For now we only support images, so we throw
            throw new IOException("Failed to process and store image as WebP: " + filename, e);
        }

        return "/uploads/" + filename;
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
