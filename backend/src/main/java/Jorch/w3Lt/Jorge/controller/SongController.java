package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.SongDTO;
import Jorch.w3Lt.Jorge.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
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
    public SongDTO saveSong(@RequestBody SongDTO songDTO) {
        return songService.saveSong(songDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
    }
}
