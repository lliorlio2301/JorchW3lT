package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.ResumeDTO;
import Jorch.w3Lt.Jorge.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    public List<ResumeDTO> getAllResumes() {
        return resumeService.getAllResumes();
    }

    @GetMapping("/{id}")
    public ResumeDTO getResumeById(@PathVariable Long id) {
        return resumeService.getResumeById(id);
    }

    @PostMapping
    public ResumeDTO saveResume(@RequestBody ResumeDTO resumeDTO) {
        return resumeService.saveResume(resumeDTO);
    }
}
