package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.GalleryImageDTO;
import Jorch.w3Lt.Jorge.service.GalleryImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GalleryImageController {

    private final GalleryImageService service;

    @GetMapping
    public List<GalleryImageDTO> getAllImages() {
        return service.getAllImages();
    }

    @GetMapping("/highlight")
    public GalleryImageDTO getMonthlyHighlight() {
        return service.getMonthlyHighlight();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public GalleryImageDTO saveImage(@RequestBody GalleryImageDTO dto) {
        return service.saveImage(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        service.deleteImage(id);
        return ResponseEntity.ok().build();
    }
}
