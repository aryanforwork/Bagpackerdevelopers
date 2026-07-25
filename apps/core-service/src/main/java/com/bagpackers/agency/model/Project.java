package com.bagpackers.agency.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotNull(message = "Client ID is required")
    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @NotBlank(message = "Project name is required")
    @Column(name = "project_name", nullable = false)
    private String projectName;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotBlank(message = "Field of work is required")
    @Column(name = "field_of_work", nullable = false)
    private String fieldOfWork;

    @NotBlank(message = "Estimated duration is required")
    @Column(name = "estimated_duration", nullable = false)
    private String estimatedDuration;

    @NotNull(message = "Estimated budget is required")
    @Column(name = "estimated_budget", nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedBudget;

    @NotBlank(message = "Budget currency is required")
    @Column(name = "budget_currency", nullable = false)
    private String budgetCurrency;

    @Column(nullable = false)
    private String status = "submitted";

    @Column(name = "assigned_developer_id")
    private UUID assignedDeveloperId;

    @Column(name = "is_portfolio_ready", nullable = false)
    private boolean isPortfolioReady = false;

    @Column(name = "client_consent_public", nullable = false)
    private boolean clientConsentPublic = false;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
        if (status == null) {
            status = "submitted";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public Project() {}

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getClientId() {
        return clientId;
    }

    public void setClientId(UUID clientId) {
        this.clientId = clientId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFieldOfWork() {
        return fieldOfWork;
    }

    public void setFieldOfWork(String fieldOfWork) {
        this.fieldOfWork = fieldOfWork;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public BigDecimal getEstimatedBudget() {
        return estimatedBudget;
    }

    public void setEstimatedBudget(BigDecimal estimatedBudget) {
        this.estimatedBudget = estimatedBudget;
    }

    public String getBudgetCurrency() {
        return budgetCurrency;
    }

    public void setBudgetCurrency(String budgetCurrency) {
        this.budgetCurrency = budgetCurrency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UUID getAssignedDeveloperId() {
        return assignedDeveloperId;
    }

    public void setAssignedDeveloperId(UUID assignedDeveloperId) {
        this.assignedDeveloperId = assignedDeveloperId;
    }

    public boolean isPortfolioReady() {
        return isPortfolioReady;
    }

    public void setPortfolioReady(boolean portfolioReady) {
        isPortfolioReady = portfolioReady;
    }

    public boolean isClientConsentPublic() {
        return clientConsentPublic;
    }

    public void setClientConsentPublic(boolean clientConsentPublic) {
        this.clientConsentPublic = clientConsentPublic;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
