package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.ListItemDTO;
import Jorch.w3Lt.Jorge.model.ListItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ListItemMapper {
    ListItemDTO toDto(ListItem listItem);
    ListItem toEntity(ListItemDTO listItemDTO);
}
