package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.SongDTO;
import Jorch.w3Lt.Jorge.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @GetMapping
    public List<SongDTO> getAllSongs() {
        return songService.getAllSongs();
    }

    @GetMapping("/{id}")
    public SongDTO getSongById(@PathVariable Long id) {
        return songService.getSongById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SongDTO saveSong(@RequestBody SongDTO songDTO) {
        return songService.saveSong(songDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SongDTO updateSong(@PathVariable Long id, @RequestBody SongDTO songDTO) {
        return songService.updateSong(id, songDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
    }
}
