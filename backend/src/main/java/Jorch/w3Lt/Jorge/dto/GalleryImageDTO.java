package Jorch.w3Lt.Jorge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GalleryImageDTO {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String imageAlt;
    private boolean monthlyHighlight;
    private boolean hasBackground;
    private LocalDateTime createdAt;
}
