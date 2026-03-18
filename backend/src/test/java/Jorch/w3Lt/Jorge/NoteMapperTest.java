package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.dto.NoteDTO;
import Jorch.w3Lt.Jorge.dto.NoteItemDTO;
import Jorch.w3Lt.Jorge.mapper.NoteMapper;
import Jorch.w3Lt.Jorge.model.Note;
import Jorch.w3Lt.Jorge.model.NoteItem;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class NoteMapperTest {

    private final NoteMapper mapper = Mappers.getMapper(NoteMapper.class);

    @Test
    void shouldMapNoteWithItemsToDto() {
        // Given
        NoteItem item = NoteItem.builder()
                .id(1L)
                .text("Test Item")
                .completed(true)
                .isChecklist(false)
                .build();
        
        Note note = Note.builder()
                .id(10L)
                .title("Note Title")
                .noteItems(List.of(item))
                .build();
        item.setNote(note);

        // When
        NoteDTO dto = mapper.toDto(note);

        // Then
        assertThat(dto.getId()).isEqualTo(10L);
        assertThat(dto.getTitle()).isEqualTo("Note Title");
        assertThat(dto.getNoteItems()).hasSize(1);
        
        NoteItemDTO itemDto = dto.getNoteItems().get(0);
        assertThat(itemDto.getId()).isEqualTo(1L);
        assertThat(itemDto.getText()).isEqualTo("Test Item");
        assertThat(itemDto.isCompleted()).isTrue();
        assertThat(itemDto.isChecklist()).isFalse();
    }

    @Test
    void shouldMapDtoToEntityAndSetParentReference() {
        // Given
        NoteItemDTO itemDto = NoteItemDTO.builder()
                .text("New Item")
                .completed(false)
                .isChecklist(true)
                .build();

        NoteDTO noteDto = NoteDTO.builder()
                .title("New Note")
                .noteItems(List.of(itemDto))
                .build();

        // When
        Note note = mapper.toEntity(noteDto);

        // Then
        assertThat(note.getTitle()).isEqualTo("New Note");
        assertThat(note.getNoteItems()).hasSize(1);
        assertThat(note.getNoteItems().get(0).getText()).isEqualTo("New Item");
        assertThat(note.getNoteItems().get(0).getNote()).isEqualTo(note); // Verify @AfterMapping parent set
    }
}
