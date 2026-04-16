package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.dto.NoteDTO;
import Jorch.w3Lt.Jorge.mapper.NoteMapper;
import Jorch.w3Lt.Jorge.model.Note;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;

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
                .pinned(true)
                .archived(false)
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now())
                .build();

        // When
        NoteDTO dto = mapper.toDto(note);

        // Then
        assertThat(dto.getId()).isEqualTo(10L);
        assertThat(dto.getTitle()).isEqualTo("Note Title");
        assertThat(dto.getContent()).isEqualTo("# Markdown Content");
        assertThat(dto.isPinned()).isTrue();
        assertThat(dto.isArchived()).isFalse();
        assertThat(dto.getUpdatedAt()).isNotNull();
    }

    @Test
    void shouldMapDtoToEntity() {
        // Given
        NoteDTO noteDto = NoteDTO.builder()
                .title("New Note")
                .content("New Content")
                .pinned(true)
                .archived(true)
                .build();

        // When
        Note note = mapper.toEntity(noteDto);

        // Then
        assertThat(note.getTitle()).isEqualTo("New Note");
        assertThat(note.getContent()).isEqualTo("New Content");
        assertThat(note.isPinned()).isTrue();
        assertThat(note.isArchived()).isTrue();
    }
}
