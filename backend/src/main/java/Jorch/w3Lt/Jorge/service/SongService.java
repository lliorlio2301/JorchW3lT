package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.SongDTO;
import Jorch.w3Lt.Jorge.mapper.SongMapper;
import Jorch.w3Lt.Jorge.model.Song;
import Jorch.w3Lt.Jorge.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final SongMapper songMapper;

    public List<SongDTO> getAllSongs() {
        return songRepository.findAll().stream()
                .map(songMapper::toDto)
                .collect(Collectors.toList());
    }

    public SongDTO getSongById(Long id) {
        return songRepository.findById(id)
                .map(songMapper::toDto)
                .orElse(null);
    }

    public SongDTO saveSong(SongDTO songDTO) {
        Song song = songMapper.toEntity(songDTO);
        Song savedSong = songRepository.save(song);
        return songMapper.toDto(savedSong);
    }

    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }
}
