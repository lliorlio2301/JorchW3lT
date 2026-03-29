package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.ShortStoryDTO;
import Jorch.w3Lt.Jorge.mapper.ShortStoryMapper;
import Jorch.w3Lt.Jorge.model.ShortStory;
import Jorch.w3Lt.Jorge.repository.ShortStoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShortStoryService {

    private final ShortStoryRepository repository;
    private final ShortStoryMapper mapper;

    @Transactional(readOnly = true)
    public List<ShortStoryDTO> getAllStories() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ShortStoryDTO getStory(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElse(null);
    }

    @Transactional
    public ShortStoryDTO saveStory(ShortStoryDTO dto) {
        ShortStory story = mapper.toEntity(dto);
        return mapper.toDto(repository.save(story));
    }

    @Transactional
    public void deleteStory(Long id) {
        repository.deleteById(id);
    }
}
