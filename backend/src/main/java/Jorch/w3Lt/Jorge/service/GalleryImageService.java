package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.GalleryImageDTO;
import Jorch.w3Lt.Jorge.mapper.GalleryImageMapper;
import Jorch.w3Lt.Jorge.model.GalleryImage;
import Jorch.w3Lt.Jorge.repository.GalleryImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GalleryImageService {

    private final GalleryImageRepository repository;
    private final GalleryImageMapper mapper;

    @Transactional(readOnly = true)
    public List<GalleryImageDTO> getAllImages() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GalleryImageDTO getMonthlyHighlight() {
        return repository.findFirstByMonthlyHighlightTrueOrderByCreatedAtDesc()
                .map(mapper::toDto)
                .orElse(null);
    }

    @Transactional
    public GalleryImageDTO saveImage(GalleryImageDTO dto) {
        if (dto.isMonthlyHighlight()) {
            // Reset existing highlight
            repository.findFirstByMonthlyHighlightTrueOrderByCreatedAtDesc().ifPresent(h -> {
                h.setMonthlyHighlight(false);
                repository.save(h);
            });
        }
        GalleryImage image = mapper.toEntity(dto);
        if (image.getCreatedAt() == null) {
            image.setCreatedAt(java.time.LocalDateTime.now());
        }
        return mapper.toDto(repository.save(image));
    }

    @Transactional
    public void deleteImage(Long id) {
        repository.deleteById(id);
    }
}
