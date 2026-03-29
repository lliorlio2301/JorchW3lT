package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.dto.GalleryImageDTO;
import Jorch.w3Lt.Jorge.service.GalleryImageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
public class GalleryImageIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private GalleryImageService service;

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    @Test
    void testSaveAndFetchGalleryImage() {
        GalleryImageDTO dto = GalleryImageDTO.builder()
                .title("Test Highlight")
                .description("Sample description")
                .imageUrl("/uploads/test.jpg")
                .monthlyHighlight(true)
                .hasBackground(false)
                .build();

        GalleryImageDTO saved = service.saveImage(dto);
        entityManager.flush();
        entityManager.clear();

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("Test Highlight");

        List<GalleryImageDTO> all = service.getAllImages();
        System.out.println("DEBUG: All images count: " + all.size());
        if (!all.isEmpty()) {
            System.out.println("DEBUG: First image highlight flag: " + all.get(0).isMonthlyHighlight());
            System.out.println("DEBUG: First image created at: " + all.get(0).getCreatedAt());
        }
        assertThat(all).hasSize(1);

        GalleryImageDTO highlight = service.getMonthlyHighlight();
        assertThat(highlight).isNotNull();
        assertThat(highlight.getTitle()).isEqualTo("Test Highlight");
    }

    @Test
    void testMultipleHighlightsTakesNewest() throws InterruptedException {
        GalleryImageDTO oldImg = GalleryImageDTO.builder()
                .title("Old")
                .imageUrl("url1")
                .monthlyHighlight(true)
                .build();
        service.saveImage(oldImg);
        entityManager.flush();
        
        // Wait a bit to ensure different timestamps
        Thread.sleep(10);

        GalleryImageDTO newImg = GalleryImageDTO.builder()
                .title("New")
                .imageUrl("url2")
                .monthlyHighlight(true)
                .build();
        service.saveImage(newImg);
        entityManager.flush();
        entityManager.clear();

        GalleryImageDTO highlight = service.getMonthlyHighlight();
        assertThat(highlight).isNotNull();
        assertThat(highlight.getTitle()).isEqualTo("New");
    }
}
