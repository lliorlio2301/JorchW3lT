package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.ResumeDTO;
import Jorch.w3Lt.Jorge.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    public ResponseEntity<ResumeDTO> getResume(@RequestParam(defaultValue = "de") String locale) {
        // Assuming there is only one resume in the system for now
        ResumeDTO resume = resumeService.getAllResumes(locale).stream()
                .findFirst()
                .orElse(null);
        return ResponseEntity.ok(resume);
    }
}
