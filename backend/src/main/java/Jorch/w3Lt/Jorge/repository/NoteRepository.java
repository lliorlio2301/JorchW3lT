package Jorch.w3Lt.Jorge.repository;

import Jorch.w3Lt.Jorge.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    @Query("""
            SELECT n FROM Note n
            WHERE n.archived = :archived
            AND (
                :query IS NULL
                OR TRIM(:query) = ''
                OR LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(COALESCE(n.content, '')) LIKE LOWER(CONCAT('%', :query, '%'))
            )
            ORDER BY n.pinned DESC, n.updatedAt DESC
            """)
    List<Note> findByArchivedAndQuery(boolean archived, String query);
}
