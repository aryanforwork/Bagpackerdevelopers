package com.bagpackers.agency.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "portfolio_items")
public class PortfolioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(name = "cover_image_url", nullable = false)
    private String coverImageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "portfolio_gallery_urls", joinColumns = @JoinColumn(name = "portfolio_item_id"))
    @Column(name = "gallery_url")
    private List<String> galleryUrls;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "portfolio_tech_used", joinColumns = @JoinColumn(name = "portfolio_item_id"))
    @Column(name = "tech")
    private List<String> techUsed;

    @Column(name = "published_at", updatable = false)
    private OffsetDateTime publishedAt;

    @PrePersist
    protected void onCreate() {
        publishedAt = OffsetDateTime.now();
    }

    public PortfolioItem() {}

    public PortfolioItem(UUID projectId, String title, String summary, String coverImageUrl, List<String> galleryUrls, List<String> techUsed) {
        this.projectId = projectId;
        this.title = title;
        this.summary = summary;
        this.coverImageUrl = coverImageUrl;
        this.galleryUrls = galleryUrls;
        this.techUsed = techUsed;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public List<String> getGalleryUrls() {
        return galleryUrls;
    }

    public void setGalleryUrls(List<String> galleryUrls) {
        this.galleryUrls = galleryUrls;
    }

    public List<String> getTechUsed() {
        return techUsed;
    }

    public void setTechUsed(List<String> techUsed) {
        this.techUsed = techUsed;
    }

    public OffsetDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(OffsetDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}
