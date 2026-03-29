package Jorch.w3Lt.Jorge.repository;

import Jorch.w3Lt.Jorge.model.ShortStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShortStoryRepository extends JpaRepository<ShortStory, Long> {
}
