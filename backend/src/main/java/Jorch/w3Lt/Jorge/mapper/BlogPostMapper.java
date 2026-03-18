package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.BlogPostDTO;
import Jorch.w3Lt.Jorge.model.BlogPost;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BlogPostMapper {
    BlogPostDTO toDto(BlogPost blogPost);
    BlogPost toEntity(BlogPostDTO blogPostDTO);
}
