package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.ListItemDTO;
import Jorch.w3Lt.Jorge.mapper.ListItemMapper;
import Jorch.w3Lt.Jorge.model.ListItem;
import Jorch.w3Lt.Jorge.repository.ListItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListItemService {

    private final ListItemRepository listItemRepository;
    private final ListItemMapper listItemMapper;

    public List<ListItemDTO> getAllItems() {
        return listItemRepository.findAll().stream()
                .map(listItemMapper::toDto)
                .collect(Collectors.toList());
    }

    public ListItemDTO saveItem(ListItemDTO listItemDTO) {
        ListItem item = listItemMapper.toEntity(listItemDTO);
        return listItemMapper.toDto(listItemRepository.save(item));
    }

    public void deleteItem(Long id) {
        listItemRepository.deleteById(id);
    }

    public ListItemDTO toggleCompleted(Long id) {
        ListItem item = listItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setCompleted(!item.isCompleted());
        return listItemMapper.toDto(listItemRepository.save(item));
    }
}
