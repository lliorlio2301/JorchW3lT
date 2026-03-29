package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.GalleryImageDTO;
import Jorch.w3Lt.Jorge.model.GalleryImage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GalleryImageMapper {
    GalleryImageDTO toDto(GalleryImage image);
    GalleryImage toEntity(GalleryImageDTO dto);
}
