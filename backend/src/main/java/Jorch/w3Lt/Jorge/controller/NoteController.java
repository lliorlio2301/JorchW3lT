package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.NoteDTO;
import Jorch.w3Lt.Jorge.service.NoteService;
import lombok.RequiredArgsConstructor;
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
    public List<NoteDTO> getAllNotes() {
        return noteService.getAllNotes();
    }

    @GetMapping("/{id}")
    public NoteDTO getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id);
    }

    @PostMapping
    public NoteDTO saveNote(@RequestBody NoteDTO noteDTO) {
        return noteService.saveNote(noteDTO);
    }

    @PutMapping("/{id}")
    public NoteDTO updateNote(@PathVariable Long id, @RequestBody NoteDTO noteDTO) {
        noteDTO.setId(id);
        return noteService.saveNote(noteDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
    }
}
