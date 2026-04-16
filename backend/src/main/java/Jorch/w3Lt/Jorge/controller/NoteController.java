package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.NoteDTO;
import Jorch.w3Lt.Jorge.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<List<NoteDTO>> getAllNotes(
            @RequestParam(value = "archived", required = false) Boolean archived,
            @RequestParam(value = "query", required = false) String query) {
        return ResponseEntity.ok(noteService.getAllNotes(archived, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDTO> getNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(noteService.getNoteById(id));
    }

    @PostMapping
    public ResponseEntity<NoteDTO> saveNote(@RequestBody NoteDTO noteDTO) {
        return ResponseEntity.ok(noteService.saveNote(noteDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDTO> updateNote(@PathVariable Long id, @RequestBody NoteDTO noteDTO) {
        noteDTO.setId(id);
        return ResponseEntity.ok(noteService.saveNote(noteDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/pin")
    public ResponseEntity<NoteDTO> setPinned(@PathVariable Long id, @RequestParam("pinned") boolean pinned) {
        return ResponseEntity.ok(noteService.setPinned(id, pinned));
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<NoteDTO> setArchived(@PathVariable Long id, @RequestParam("archived") boolean archived) {
        return ResponseEntity.ok(noteService.setArchived(id, archived));
    }
}
