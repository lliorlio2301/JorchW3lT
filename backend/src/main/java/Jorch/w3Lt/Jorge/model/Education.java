package Jorch.w3Lt.Jorge.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String institution;
    private String startDate;
    private String endDate;

    // Localized fields
    private String degreeDe;
    private String degreeEn;
    private String degreeEs;

    private String locationDe;
    private String locationEn;
    private String locationEs;

    @Column(columnDefinition = "TEXT")
    private String descriptionDe;
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;
    @Column(columnDefinition = "TEXT")
    private String descriptionEs;
}
