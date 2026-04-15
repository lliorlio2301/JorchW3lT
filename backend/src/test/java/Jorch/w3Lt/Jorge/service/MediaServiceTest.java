package Jorch.w3Lt.Jorge.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;

class MediaServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void shouldUploadAndConvertToWebP() throws IOException {
        // Given
        MediaService mediaService = new MediaService();
        ReflectionTestUtils.setField(mediaService, "uploadDir", tempDir.toString());

        // Create a dummy JPEG image
        BufferedImage image = new BufferedImage(10, 10, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "jpg", baos);
        
        MockMultipartFile file = new MockMultipartFile(
                "file", "test-image.jpg", "image/jpeg", baos.toByteArray());

        // When
        String resultUrl = mediaService.uploadFile(file);

        // Then
        assertThat(resultUrl).startsWith("/uploads/");
        assertThat(resultUrl).endsWith(".webp");

        String filename = resultUrl.replace("/uploads/", "");
        File outputFile = tempDir.resolve(filename).toFile();
        assertThat(outputFile).exists();
        
        // Basic check if it's a valid file and has some content
        assertThat(outputFile.length()).isGreaterThan(0);
    }

    @Test
    void shouldSanitizeUnicodeFilenameToAscii() throws IOException {
        MediaService mediaService = new MediaService();
        ReflectionTestUtils.setField(mediaService, "uploadDir", tempDir.toString());

        BufferedImage image = new BufferedImage(10, 10, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "jpg", baos);

        MockMultipartFile file = new MockMultipartFile(
                "file", "BärIcon.jpg", "image/jpeg", baos.toByteArray());

        String resultUrl = mediaService.uploadFile(file);
        String filename = resultUrl.replace("/uploads/", "");

        assertThat(Pattern.matches("[a-f0-9\\-]+_baricon\\.webp", filename)).isTrue();
        assertThat(tempDir.resolve(filename)).exists();
    }

    @Test
    void shouldDeleteFile() throws IOException {
        // Given
        MediaService mediaService = new MediaService();
        ReflectionTestUtils.setField(mediaService, "uploadDir", tempDir.toString());
        
        Path testFile = tempDir.resolve("to-delete.webp");
        java.nio.file.Files.createFile(testFile);
        assertThat(testFile).exists();

        // When
        mediaService.deleteFile("/uploads/to-delete.webp");

        // Then
        assertThat(testFile).doesNotExist();
    }
}
