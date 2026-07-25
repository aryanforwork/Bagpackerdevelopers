package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.CaseStudy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CaseStudyRepository extends JpaRepository<CaseStudy, UUID> {
    Optional<CaseStudy> findBySlug(String slug);
}
