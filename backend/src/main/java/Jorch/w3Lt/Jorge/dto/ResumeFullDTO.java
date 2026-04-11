package Jorch.w3Lt.Jorge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeFullDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String locationDe;
    private String locationEn;
    private String locationEs;
    private String summaryDe;
    private String summaryEn;
    private String summaryEs;
    private List<ExperienceFullDTO> experiences;
    private List<EducationFullDTO> education;
}
