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

    public List<ResumeDTO> getAllResumes() {
        return resumeRepository.findAll().stream()
                .map(resumeMapper::toDto)
                .collect(Collectors.toList());
    }

    public ResumeDTO getResumeById(Long id) {
        return resumeRepository.findById(id)
                .map(resumeMapper::toDto)
                .orElse(null);
    }

    public ResumeDTO saveResume(ResumeDTO resumeDTO) {
        Resume resume = resumeMapper.toEntity(resumeDTO);
        Resume savedResume = resumeRepository.save(resume);
        return resumeMapper.toDto(savedResume);
    }
}
