package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.ListItemDTO;
import Jorch.w3Lt.Jorge.service.ListItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shopping-list")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ListItemController {

    private final ListItemService listItemService;

    @GetMapping
    public List<ListItemDTO> getAllItems() {
        return listItemService.getAllItems();
    }

    @PostMapping
    public ListItemDTO saveItem(@RequestBody ListItemDTO listItemDTO) {
        return listItemService.saveItem(listItemDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        listItemService.deleteItem(id);
    }

    @PatchMapping("/{id}/toggle")
    public ListItemDTO toggleCompleted(@PathVariable Long id) {
        return listItemService.toggleCompleted(id);
    }
}
