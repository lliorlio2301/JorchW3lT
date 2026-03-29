package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.ShortStoryDTO;
import Jorch.w3Lt.Jorge.service.ShortStoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShortStoryController {

    private final ShortStoryService service;

    @GetMapping
    public List<ShortStoryDTO> getAllStories() {
        return service.getAllStories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShortStoryDTO> getStory(@PathVariable Long id) {
        ShortStoryDTO story = service.getStory(id);
        return story != null ? ResponseEntity.ok(story) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ShortStoryDTO saveStory(@RequestBody ShortStoryDTO dto) {
        return service.saveStory(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStory(@PathVariable Long id) {
        service.deleteStory(id);
        return ResponseEntity.ok().build();
    }
}
