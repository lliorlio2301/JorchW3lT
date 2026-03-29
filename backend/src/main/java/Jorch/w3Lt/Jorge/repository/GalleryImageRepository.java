package Jorch.w3Lt.Jorge.repository;

import Jorch.w3Lt.Jorge.model.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    Optional<GalleryImage> findFirstByMonthlyHighlightTrueOrderByCreatedAtDesc();
}
