package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.ResumeDTO;
import Jorch.w3Lt.Jorge.mapper.ResumeMapper;
import Jorch.w3Lt.Jorge.model.Resume;
import Jorch.w3Lt.Jorge.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeMapper resumeMapper;

    public List<ResumeDTO> getAllResumes(String locale) {
        return resumeRepository.findAll().stream()
                .map(resume -> resumeMapper.toDto(resume, locale))
                .collect(Collectors.toList());
    }

    public ResumeDTO getResumeById(Long id, String locale) {
        return resumeRepository.findById(id)
                .map(resume -> resumeMapper.toDto(resume, locale))
                .orElse(null);
    }

    public ResumeDTO saveResume(ResumeDTO resumeDTO) {
        // Saving logic would need to handle mapping back from DTO to Entity localized fields
        // For now, let's keep it simple as the focus is on Phase 2 (Reading localized data)
        return null; 
    }
}
