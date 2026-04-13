package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.AbstractIntegrationTest;
import Jorch.w3Lt.Jorge.dto.ProjectDTO;
import Jorch.w3Lt.Jorge.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ProjectServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    void setup() {
        projectRepository.deleteAll();
    }

    @Test
    void shouldSaveAndRetrieveProject() {
        ProjectDTO dto = ProjectDTO.builder()
                .title("My Awesome Project")
                .description("Detailed description")
                .imageAlt("Project image description")
                .techTags(List.of("React", "Spring Boot"))
                .build();

        ProjectDTO saved = projectService.saveProject(dto);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("My Awesome Project");

        List<ProjectDTO> all = projectService.getAllProjects();
        assertThat(all).hasSize(1);
        assertThat(all.get(0).getTitle()).isEqualTo("My Awesome Project");
        assertThat(all.get(0).getImageAlt()).isEqualTo("Project image description");
    }

    @Test
    void shouldUpdateProject() {
        ProjectDTO dto = ProjectDTO.builder()
                .title("Initial Title")
                .description("Initial description")
                .build();
        ProjectDTO saved = projectService.saveProject(dto);

        saved.setTitle("Updated Title");
        saved.setImageAlt("Updated project image alt text");
        ProjectDTO updated = projectService.updateProject(saved.getId(), saved);

        assertThat(updated.getTitle()).isEqualTo("Updated Title");
        
        ProjectDTO fetched = projectService.getProjectById(saved.getId());
        assertThat(fetched.getTitle()).isEqualTo("Updated Title");
        assertThat(fetched.getImageAlt()).isEqualTo("Updated project image alt text");
    }

    @Test
    void shouldDeleteProject() {
        ProjectDTO saved = projectService.saveProject(ProjectDTO.builder().title("To delete").build());
        assertThat(projectService.getAllProjects()).hasSize(1);

        projectService.deleteProject(saved.getId());
        assertThat(projectService.getAllProjects()).isEmpty();
    }
}
