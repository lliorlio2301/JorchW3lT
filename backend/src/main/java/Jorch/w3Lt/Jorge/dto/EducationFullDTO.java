package Jorch.w3Lt.Jorge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationFullDTO {
    private Long id;
    private String degreeDe;
    private String degreeEn;
    private String degreeEs;
    private String institution;
    private String locationDe;
    private String locationEn;
    private String locationEs;
    private String startDate;
    private String endDate;
    private String descriptionDe;
    private String descriptionEn;
    private String descriptionEs;
}
