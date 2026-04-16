package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.model.Note;
import Jorch.w3Lt.Jorge.repository.NoteRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

class NoteIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private NoteRepository noteRepository;

    @Test
    void shouldReturn403WhenAccessingNotesWithoutAuth() {
        // When
        ResponseEntity<String> response = restTemplate.getForEntity("/api/notes", String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @Transactional
    void shouldPersistNoteCorrectly() {
        // Given
        Note note = Note.builder()
                .title("Integration Database Note")
                .content("# Markdown Content")
                .pinned(true)
                .build();

        // When
        Note saved = noteRepository.save(note);

        // Then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getContent()).isEqualTo("# Markdown Content");
        assertThat(saved.getUpdatedAt()).isNotNull();
        assertThat(saved.isPinned()).isTrue();
        assertThat(saved.isArchived()).isFalse();
        
        // Cleanup
        noteRepository.delete(saved);
        assertThat(noteRepository.count()).isZero();
    }

    @Test
    @Transactional
    void shouldFindNotesByArchivedWithoutSearchQuery() {
        Note active = noteRepository.save(Note.builder()
                .title("Active note")
                .content("alpha")
                .archived(false)
                .pinned(true)
                .build());
        Note archived = noteRepository.save(Note.builder()
                .title("Archived note")
                .content("beta")
                .archived(true)
                .build());

        assertThat(noteRepository.findByArchived(false))
                .extracting(Note::getId)
                .contains(active.getId())
                .doesNotContain(archived.getId());
    }
}
