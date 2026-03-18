package Jorch.w3Lt.Jorge.repository;

import Jorch.w3Lt.Jorge.model.NoteItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteItemRepository extends JpaRepository<NoteItem, Long> {
}
