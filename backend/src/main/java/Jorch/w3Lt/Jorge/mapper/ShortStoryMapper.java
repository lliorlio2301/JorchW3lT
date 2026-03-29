package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.ShortStoryDTO;
import Jorch.w3Lt.Jorge.model.ShortStory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShortStoryMapper {
    ShortStoryDTO toDto(ShortStory story);
    ShortStory toEntity(ShortStoryDTO dto);
}
