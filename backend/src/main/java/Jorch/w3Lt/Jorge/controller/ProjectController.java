package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.ProjectCreateDTO;
import Jorch.w3Lt.Jorge.dto.ProjectDTO;
import Jorch.w3Lt.Jorge.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<ProjectDTO> getAllProjects(@RequestHeader(value = "Accept-Language", required = false) String locale) {
        return projectService.getAllProjects(locale);
    }

    @GetMapping("/{id}")
    public ProjectDTO getProjectById(@PathVariable Long id, @RequestHeader(value = "Accept-Language", required = false) String locale) {
        return projectService.getProjectById(id, locale);
    }

    @GetMapping("/{id}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectCreateDTO getProjectForEdit(@PathVariable Long id) {
        return projectService.getProjectForEdit(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectDTO saveProject(@RequestBody ProjectCreateDTO projectDTO) {
        return projectService.saveProject(projectDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectDTO updateProject(@PathVariable Long id, @RequestBody ProjectCreateDTO projectDTO) {
        return projectService.updateProject(id, projectDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}
