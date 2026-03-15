package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.ProjectDTO;
import Jorch.w3Lt.Jorge.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
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
}
