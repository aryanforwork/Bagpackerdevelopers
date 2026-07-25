package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Page<Project> findByClientId(UUID clientId, Pageable pageable);
    Page<Project> findByStatus(String status, Pageable pageable);
}
