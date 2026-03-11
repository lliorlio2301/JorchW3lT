package Jorch.w3Lt.Jorge.repository;

import Jorch.w3Lt.Jorge.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
}
