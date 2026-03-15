package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.model.Resume;
import Jorch.w3Lt.Jorge.repository.ResumeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

public class ResumeIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ResumeRepository resumeRepository;

    @Test
    void shouldFetchResume() {
        // Given
        Resume resume = Resume.builder()
                .name("Test Jorch")
                .summaryDe("Hallo")
                .summaryEn("Hello")
                .summaryEs("Hola")
                .build();
        resumeRepository.save(resume);

        // When
        ResponseEntity<Object> response = restTemplate.getForEntity("/api/resume", Object.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
    
    @Test
    void postgresContainerIsRunning() {
        assertThat(postgres.isRunning()).isTrue();
    }
}
