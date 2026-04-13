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
public class BlogPostDTO {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String summary;
    private String coverImageUrl;
    private String coverImageAlt;
    private java.util.List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
