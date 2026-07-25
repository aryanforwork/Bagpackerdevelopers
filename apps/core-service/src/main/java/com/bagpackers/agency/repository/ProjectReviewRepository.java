package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.ProjectReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProjectReviewRepository extends JpaRepository<ProjectReview, UUID> {
    List<ProjectReview> findByDeveloperId(UUID developerId);
    List<ProjectReview> findByProjectId(UUID projectId);
}
