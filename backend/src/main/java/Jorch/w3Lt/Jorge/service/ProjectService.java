package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.ProjectDTO;
import Jorch.w3Lt.Jorge.mapper.ProjectMapper;
import Jorch.w3Lt.Jorge.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public List<ProjectDTO> getAllProjects(String locale) {
        return projectRepository.findAll().stream()
                .map(project -> projectMapper.toDto(project, locale))
                .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(Long id, String locale) {
        return projectRepository.findById(id)
                .map(project -> projectMapper.toDto(project, locale))
                .orElse(null);
    }
}
