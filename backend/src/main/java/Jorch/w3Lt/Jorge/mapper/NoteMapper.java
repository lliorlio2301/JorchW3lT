package Jorch.w3Lt.Jorge.mapper;

import Jorch.w3Lt.Jorge.dto.NoteDTO;
import Jorch.w3Lt.Jorge.dto.NoteItemDTO;
import Jorch.w3Lt.Jorge.model.Note;
import Jorch.w3Lt.Jorge.model.NoteItem;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NoteMapper {
    NoteDTO toDto(Note note);
    Note toEntity(NoteDTO noteDTO);

    NoteItemDTO toDto(NoteItem noteItem);
    NoteItem toEntity(NoteItemDTO noteItemDTO);

    @AfterMapping
    default void setNoteReference(@MappingTarget Note note) {
        if (note.getNoteItems() != null) {
            note.getNoteItems().forEach(item -> item.setNote(note));
        }
    }
}
