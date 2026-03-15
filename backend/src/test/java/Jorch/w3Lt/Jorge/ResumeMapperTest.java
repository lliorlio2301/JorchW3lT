package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.dto.ResumeDTO;
import Jorch.w3Lt.Jorge.mapper.ResumeMapper;
import Jorch.w3Lt.Jorge.model.Resume;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.assertj.core.api.Assertions.assertThat;

class ResumeMapperTest {

    private final ResumeMapper mapper = Mappers.getMapper(ResumeMapper.class);

    @Test
    void shouldMapGermanSummary() {
        // Given
        Resume resume = Resume.builder()
                .summaryDe("Deutsch")
                .summaryEn("English")
                .build();

        // When
        ResumeDTO dto = mapper.toDto(resume, "de");

        // Then
        assertThat(dto.getSummary()).isEqualTo("Deutsch");
    }

    @Test
    void shouldMapEnglishSummaryByDefault() {
        // Given
        Resume resume = Resume.builder()
                .summaryDe("Deutsch")
                .summaryEn("English")
                .build();

        // When
        ResumeDTO dto = mapper.toDto(resume, "en");

        // Then
        assertThat(dto.getSummary()).isEqualTo("English");
    }
}
