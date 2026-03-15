package Jorch.w3Lt.Jorge.repository;

import Jorch.w3Lt.Jorge.model.ListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListItemRepository extends JpaRepository<ListItem, Long> {
}
