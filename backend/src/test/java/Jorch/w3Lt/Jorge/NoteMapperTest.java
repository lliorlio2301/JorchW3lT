package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.dto.NoteDTO;
import Jorch.w3Lt.Jorge.mapper.NoteMapper;
import Jorch.w3Lt.Jorge.model.Note;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.assertj.core.api.Assertions.assertThat;

class NoteMapperTest {

    private final NoteMapper mapper = Mappers.getMapper(NoteMapper.class);

    @Test
    void shouldMapNoteToDto() {
        // Given
        Note note = Note.builder()
                .id(10L)
                .title("Note Title")
                .content("# Markdown Content")
                .build();

        // When
        NoteDTO dto = mapper.toDto(note);

        // Then
        assertThat(dto.getId()).isEqualTo(10L);
        assertThat(dto.getTitle()).isEqualTo("Note Title");
        assertThat(dto.getContent()).isEqualTo("# Markdown Content");
    }

    @Test
    void shouldMapDtoToEntity() {
        // Given
        NoteDTO noteDto = NoteDTO.builder()
                .title("New Note")
                .content("New Content")
                .build();

        // When
        Note note = mapper.toEntity(noteDto);

        // Then
        assertThat(note.getTitle()).isEqualTo("New Note");
        assertThat(note.getContent()).isEqualTo("New Content");
    }
}
