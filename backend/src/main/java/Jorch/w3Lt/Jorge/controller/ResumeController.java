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
    public List<ResumeDTO> getAllResumes(@RequestHeader(value = "Accept-Language", required = false) String locale) {
        return resumeService.getAllResumes(locale);
    }

    @GetMapping("/{id}")
    public ResumeDTO getResumeById(@PathVariable Long id, @RequestHeader(value = "Accept-Language", required = false) String locale) {
        return resumeService.getResumeById(id, locale);
    }

    @PostMapping
    public ResumeDTO saveResume(@RequestBody ResumeDTO resumeDTO) {
        return resumeService.saveResume(resumeDTO);
    }
}
