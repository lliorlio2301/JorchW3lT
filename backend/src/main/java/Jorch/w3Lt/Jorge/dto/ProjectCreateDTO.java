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
public class ProjectCreateDTO {
    private Long id;
    private String titleDe;
    private String titleEn;
    private String titleEs;
    private String descriptionDe;
    private String descriptionEn;
    private String descriptionEs;
    private String imageUrl;
    private String githubUrl;
    private String demoUrl;
    private List<String> techTags;
}
