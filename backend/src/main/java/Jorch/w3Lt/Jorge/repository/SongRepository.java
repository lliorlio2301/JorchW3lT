package Jorch.w3Lt.Jorge.repository;

import Jorch.w3Lt.Jorge.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
}
