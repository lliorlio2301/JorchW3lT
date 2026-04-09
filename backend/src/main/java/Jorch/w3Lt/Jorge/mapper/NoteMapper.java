package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.NoteDTO;
import Jorch.w3Lt.Jorge.model.Note;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NoteMapper {
    NoteDTO toDto(Note note);
    Note toEntity(NoteDTO noteDTO);
}
