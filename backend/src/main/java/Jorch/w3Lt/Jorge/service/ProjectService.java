package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.ProjectCreateDTO;
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

    public ProjectCreateDTO getProjectForEdit(Long id) {
        return projectRepository.findById(id)
                .map(projectMapper::toCreateDto)
                .orElse(null);
    }

    public ProjectDTO saveProject(ProjectCreateDTO dto) {
        Project project = projectMapper.toEntity(dto);
        Project savedProject = projectRepository.save(project);
        return projectMapper.toDto(savedProject, null);
    }

    public ProjectDTO updateProject(Long id, ProjectCreateDTO dto) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setTitleDe(dto.getTitleDe());
                    existingProject.setTitleEn(dto.getTitleEn());
                    existingProject.setTitleEs(dto.getTitleEs());
                    existingProject.setDescriptionDe(dto.getDescriptionDe());
                    existingProject.setDescriptionEn(dto.getDescriptionEn());
                    existingProject.setDescriptionEs(dto.getDescriptionEs());
                    existingProject.setImageUrl(dto.getImageUrl());
                    existingProject.setGithubUrl(dto.getGithubUrl());
                    existingProject.setDemoUrl(dto.getDemoUrl());
                    existingProject.setTechTags(dto.getTechTags());
                    return projectMapper.toDto(projectRepository.save(existingProject), null);
                })
                .orElse(null);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
