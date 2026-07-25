package com.bagpackers.agency.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "case_studies")
public class CaseStudy {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank(message = "Slug is required")
    @Size(max = 255, message = "Slug must not exceed 255 characters")
    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @NotNull(message = "Tech stack is required")
    @Convert(converter = JsonListConverter.class)
    @Column(name = "tech_stack", columnDefinition = "jsonb", nullable = false)
    private List<String> techStack = List.of();

    @NotNull(message = "ROI metrics are required")
    @Convert(converter = JsonMapConverter.class)
    @Column(name = "roi_metrics", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> roiMetrics = Map.of();

    @NotBlank(message = "Content is required")
    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public List<String> getTechStack() {
        return techStack;
    }

    public void setTechStack(List<String> techStack) {
        this.techStack = techStack;
    }

    public Map<String, Object> getRoiMetrics() {
        return roiMetrics;
    }

    public void setRoiMetrics(Map<String, Object> roiMetrics) {
        this.roiMetrics = roiMetrics;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
