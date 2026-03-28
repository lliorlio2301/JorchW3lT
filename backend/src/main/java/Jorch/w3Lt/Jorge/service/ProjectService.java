package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.ProjectDTO;
import Jorch.w3Lt.Jorge.mapper.ProjectMapper;
import Jorch.w3Lt.Jorge.model.Project;
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

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(projectMapper::toDto)
                .orElse(null);
    }

    public ProjectDTO saveProject(ProjectDTO dto) {
        Project project = projectMapper.toEntity(dto);
        Project savedProject = projectRepository.save(project);
        return projectMapper.toDto(savedProject);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setTitle(dto.getTitle());
                    existingProject.setDescription(dto.getDescription());
                    existingProject.setImageUrl(dto.getImageUrl());
                    existingProject.setGithubUrl(dto.getGithubUrl());
                    existingProject.setDemoUrl(dto.getDemoUrl());
                    existingProject.setTechTags(dto.getTechTags());
                    return projectMapper.toDto(projectRepository.save(existingProject));
                })
                .orElse(null);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
