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
                .build();

        // When
        Note saved = noteRepository.save(note);

        // Then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getContent()).isEqualTo("# Markdown Content");
        
        // Cleanup
        noteRepository.delete(saved);
        assertThat(noteRepository.count()).isZero();
    }
}
