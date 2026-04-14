package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.AbstractIntegrationTest;
import Jorch.w3Lt.Jorge.dto.BlogPostDTO;
import Jorch.w3Lt.Jorge.repository.BlogPostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BlogPostServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private BlogPostService blogPostService;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @BeforeEach
    void setup() {
        blogPostRepository.deleteAll();
    }

    @Test
    void shouldGenerateUniqueSlugsForDuplicateTitles() {
        // First post
        BlogPostDTO post1 = BlogPostDTO.builder()
                .title("My Test Post")
                .content("Content 1")
                .build();
        
        BlogPostDTO saved1 = blogPostService.savePost(post1);
        assertThat(saved1.getSlug()).isEqualTo("my-test-post");

        // Second post with same title
        BlogPostDTO post2 = BlogPostDTO.builder()
                .title("My Test Post")
                .content("Content 2")
                .build();
        
        BlogPostDTO saved2 = blogPostService.savePost(post2);
        assertThat(saved2.getSlug()).isEqualTo("my-test-post-1");

        // Third post with same title
        BlogPostDTO post3 = BlogPostDTO.builder()
                .title("My Test Post")
                .content("Content 3")
                .build();
        
        BlogPostDTO saved3 = blogPostService.savePost(post3);
        assertThat(saved3.getSlug()).isEqualTo("my-test-post-2");
    }

    @Test
    void shouldCleanUpSlugFormat() {
        BlogPostDTO post = BlogPostDTO.builder()
                .title("Hello!!!   World --- Test")
                .content("Content")
                .coverImageAlt("A descriptive alt text")
                .build();
        
        BlogPostDTO saved = blogPostService.savePost(post);
        assertThat(saved.getSlug()).isEqualTo("hello-world-test");
        assertThat(saved.getCoverImageAlt()).isEqualTo("A descriptive alt text");
    }
}
