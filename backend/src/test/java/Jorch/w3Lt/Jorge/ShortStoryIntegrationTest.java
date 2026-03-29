package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.dto.ShortStoryDTO;
import Jorch.w3Lt.Jorge.service.ShortStoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
public class ShortStoryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private ShortStoryService service;

    @Test
    void testSaveAndFetchShortStory() {
        ShortStoryDTO dto = ShortStoryDTO.builder()
                .title("A Tale of Two Devs")
                .content("# Chapter 1\nOnce upon a time...")
                .summary("A story about coding.")
                .coverImageUrl("cover.png")
                .build();

        ShortStoryDTO saved = service.saveStory(dto);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("A Tale of Two Devs");

        List<ShortStoryDTO> all = service.getAllStories();
        assertThat(all).hasSize(1);

        ShortStoryDTO fetched = service.getStory(saved.getId());
        assertThat(fetched).isNotNull();
        assertThat(fetched.getContent()).contains("Once upon a time");
    }
}
