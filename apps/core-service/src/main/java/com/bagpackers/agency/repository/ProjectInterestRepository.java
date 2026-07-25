package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.ProjectInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProjectInterestRepository extends JpaRepository<ProjectInterest, UUID> {
    List<ProjectInterest> findByProjectId(UUID projectId);
    List<ProjectInterest> findByDeveloperId(UUID developerId);
}
