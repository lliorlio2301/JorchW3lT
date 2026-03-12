package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.SongDTO;
import Jorch.w3Lt.Jorge.model.Song;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SongMapper {
    SongDTO toDto(Song song);
    Song toEntity(SongDTO songDTO);
}
