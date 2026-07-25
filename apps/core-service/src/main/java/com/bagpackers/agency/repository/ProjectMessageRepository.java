package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.ProjectMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProjectMessageRepository extends JpaRepository<ProjectMessage, UUID> {
    List<ProjectMessage> findByProjectIdOrderByCreatedAtAsc(UUID projectId);
}
