package com.bagpackers.agency.controller;

import com.bagpackers.agency.model.PageMetadata;
import com.bagpackers.agency.repository.PageMetadataRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/metadata")
public class PageMetadataController {

    private final PageMetadataRepository pageMetadataRepository;

    public PageMetadataController(PageMetadataRepository pageMetadataRepository) {
        this.pageMetadataRepository = pageMetadataRepository;
    }

    // Public endpoint: Fetch metadata for a specific page path (e.g. /about or /services)
    @GetMapping
    public ResponseEntity<PageMetadata> getMetadataByPath(@RequestParam String path) {
        if (path == null || path.trim().isEmpty()) {
            throw new IllegalArgumentException("Path parameter is required");
        }
        Optional<PageMetadata> metadata = pageMetadataRepository.findByPath(path.trim());
        return metadata.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Admin endpoint: List all metadata records (Secured)
    @GetMapping("/all")
    public ResponseEntity<List<PageMetadata>> getAllMetadata() {
        return ResponseEntity.ok(pageMetadataRepository.findAll());
    }

    // Admin endpoint: Create or update metadata (Secured)
    @PostMapping
    public ResponseEntity<PageMetadata> saveMetadata(@Valid @RequestBody PageMetadata metadata) {
        if (metadata.getPath() == null || metadata.getPath().trim().isEmpty()) {
            throw new IllegalArgumentException("Path is required");
        }
        if (metadata.getTitle() == null || metadata.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (metadata.getDescription() == null || metadata.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Description is required");
        }
        if (metadata.getKeywords() == null || metadata.getKeywords().trim().isEmpty()) {
            throw new IllegalArgumentException("Keywords are required");
        }

        // Clean values
        metadata.setPath(metadata.getPath().trim());
        metadata.setTitle(metadata.getTitle().trim());
        metadata.setDescription(metadata.getDescription().trim());
        metadata.setKeywords(metadata.getKeywords().trim());
        if (metadata.getOgImage() != null) metadata.setOgImage(metadata.getOgImage().trim());
        if (metadata.getOgTitle() != null) metadata.setOgTitle(metadata.getOgTitle().trim());
        if (metadata.getOgDescription() != null) metadata.setOgDescription(metadata.getOgDescription().trim());

        // Check for duplicate path on creation
        if (metadata.getId() == null) {
            Optional<PageMetadata> existing = pageMetadataRepository.findByPath(metadata.getPath());
            if (existing.isPresent()) {
                // If it exists, update it instead of failing
                PageMetadata target = existing.get();
                target.setTitle(metadata.getTitle());
                target.setDescription(metadata.getDescription());
                target.setKeywords(metadata.getKeywords());
                target.setOgImage(metadata.getOgImage());
                target.setOgTitle(metadata.getOgTitle());
                target.setOgDescription(metadata.getOgDescription());
                return ResponseEntity.ok(pageMetadataRepository.save(target));
            }
        }

        PageMetadata saved = pageMetadataRepository.save(metadata);
        return ResponseEntity.ok(saved);
    }

    // Admin endpoint: Delete metadata (Secured)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetadata(@PathVariable UUID id) {
        if (!pageMetadataRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        pageMetadataRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
