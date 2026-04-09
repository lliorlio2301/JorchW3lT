package Jorch.w3Lt.Jorge.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Uploads a file and returns the relative URL.
     * 
     * @param file The file to upload
     * @return The URL of the uploaded file (e.g. /uploads/uuid_name.jpg)
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
        String filename = UUID.randomUUID().toString() + "_" + originalFilename;

        try {
            Files.copy(file.getInputStream(), root.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IOException("Failed to store file " + filename, e);
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
            // Log error but don't throw to avoid breaking main transaction
            System.err.println("Could not delete file: " + filePath + ". Error: " + e.getMessage());
        }
    }
}
