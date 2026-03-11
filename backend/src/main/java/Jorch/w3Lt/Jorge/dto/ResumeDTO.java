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
public class ResumeDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private String summary;
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> education;
}
