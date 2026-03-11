package Jorch.w3Lt.Jorge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceDTO {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String startDate;
    private String endDate;
    private String description;
}
