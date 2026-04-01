package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.ListItemDTO;
import Jorch.w3Lt.Jorge.service.ListItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shopping")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class ListItemController {

    private final ListItemService service;

    @GetMapping
    public ResponseEntity<List<ListItemDTO>> getAllItems() {
        return ResponseEntity.ok(service.getAllItems());
    }

    @PostMapping
    public ResponseEntity<ListItemDTO> saveItem(@RequestBody ListItemDTO dto) {
        return ResponseEntity.ok(service.saveItem(dto));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<ListItemDTO> toggleCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleCompleted(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
        return ResponseEntity.ok().build();
    }
}
