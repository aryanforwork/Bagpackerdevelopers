package com.bagpackers.agency.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "lead_conversions")
public class LeadConversion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Company is required")
    @Size(max = 255, message = "Company name must not exceed 255 characters")
    @Column(nullable = false, length = 255)
    private String company;

    @NotNull(message = "Estimated manual hours is required")
    @Min(value = 0, message = "Estimated manual hours must be at least 0")
    @Column(name = "estimated_manual_hours", nullable = false)
    private Integer estimatedManualHours;

    @NotNull(message = "Projected ROI is required")
    @DecimalMin(value = "0.00", message = "Projected ROI must be at least 0.00")
    @Column(name = "projected_roi", nullable = false, precision = 12, scale = 2)
    private BigDecimal projectedRoi;

    @NotNull(message = "Contact status is required")
    @Column(name = "contact_status", nullable = false)
    private Boolean contactStatus = false;

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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Integer getEstimatedManualHours() {
        return estimatedManualHours;
    }

    public void setEstimatedManualHours(Integer estimatedManualHours) {
        this.estimatedManualHours = estimatedManualHours;
    }

    public BigDecimal getProjectedRoi() {
        return projectedRoi;
    }

    public void setProjectedRoi(BigDecimal projectedRoi) {
        this.projectedRoi = projectedRoi;
    }

    public Boolean getContactStatus() {
        return contactStatus;
    }

    public void setContactStatus(Boolean contactStatus) {
        this.contactStatus = contactStatus;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
