package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.NoteDTO;
import Jorch.w3Lt.Jorge.exception.ResourceNotFoundException;
import Jorch.w3Lt.Jorge.mapper.NoteMapper;
import Jorch.w3Lt.Jorge.model.Note;
import Jorch.w3Lt.Jorge.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;

    public List<NoteDTO> getAllNotes(Boolean archived, String query) {
        boolean archivedFilter = archived != null && archived;
        return noteRepository.findByArchivedAndQuery(archivedFilter, query).stream()
                .map(noteMapper::toDto)
                .collect(Collectors.toList());
    }

    public NoteDTO getNoteById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        return noteMapper.toDto(note);
    }

    @Transactional
    public NoteDTO saveNote(NoteDTO noteDTO) {
        Note note = noteMapper.toEntity(noteDTO);
        return noteMapper.toDto(noteRepository.save(note));
    }

    @Transactional
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    @Transactional
    public NoteDTO setPinned(Long id, boolean pinned) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        note.setPinned(pinned);
        return noteMapper.toDto(noteRepository.save(note));
    }

    @Transactional
    public NoteDTO setArchived(Long id, boolean archived) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        note.setArchived(archived);
        if (archived) {
            note.setPinned(false);
        }
        return noteMapper.toDto(noteRepository.save(note));
    }
}
