package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.PageMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PageMetadataRepository extends JpaRepository<PageMetadata, UUID> {
    Optional<PageMetadata> findByPath(String path);
}
