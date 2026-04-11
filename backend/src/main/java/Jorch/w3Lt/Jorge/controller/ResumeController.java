package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.ResumeDTO;
import Jorch.w3Lt.Jorge.dto.ResumeFullDTO;
import Jorch.w3Lt.Jorge.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    public ResponseEntity<ResumeDTO> getResume(@RequestParam(defaultValue = "de") String locale) {
        ResumeDTO resume = resumeService.getAllResumes(locale).stream()
                .findFirst()
                .orElse(null);
        return ResponseEntity.ok(resume);
    }

    @GetMapping("/full")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResumeFullDTO> getFullResume() {
        return ResponseEntity.ok(resumeService.getFullResume());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResumeFullDTO> saveResume(@RequestBody ResumeFullDTO dto) {
        return ResponseEntity.ok(resumeService.saveResume(dto));
    }
}
