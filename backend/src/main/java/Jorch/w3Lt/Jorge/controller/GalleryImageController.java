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
    public ResponseEntity<List<GalleryImageDTO>> getAllImages() {
        return ResponseEntity.ok(service.getAllImages());
    }

    @GetMapping("/highlight")
    public ResponseEntity<GalleryImageDTO> getMonthlyHighlight() {
        return ResponseEntity.ok(service.getMonthlyHighlight());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GalleryImageDTO> saveImage(@RequestBody GalleryImageDTO dto) {
        return ResponseEntity.ok(service.saveImage(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        service.deleteImage(id);
        return ResponseEntity.ok().build();
    }
}
