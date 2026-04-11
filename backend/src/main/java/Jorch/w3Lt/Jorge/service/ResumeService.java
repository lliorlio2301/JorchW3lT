package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.ResumeDTO;
import Jorch.w3Lt.Jorge.dto.ResumeFullDTO;
import Jorch.w3Lt.Jorge.mapper.ResumeMapper;
import Jorch.w3Lt.Jorge.model.Resume;
import Jorch.w3Lt.Jorge.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeMapper resumeMapper;

    @Transactional(readOnly = true)
    public List<ResumeDTO> getAllResumes(String locale) {
        return resumeRepository.findAll().stream()
                .map(resume -> resumeMapper.toDto(resume, locale))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResumeFullDTO getFullResume() {
        return resumeRepository.findAll().stream()
                .findFirst()
                .map(resumeMapper::toFullDto)
                .orElse(null);
    }

    @Transactional
    public ResumeFullDTO saveResume(ResumeFullDTO dto) {
        Resume resume = resumeMapper.toEntity(dto);
        // MapStruct handles the mapping of experiences and education lists
        // orphanRemoval = true in Resume entity handles the removal of items not in the list
        return resumeMapper.toFullDto(resumeRepository.save(resume));
    }
}
