package com.bagpackers.agency.service;

import com.bagpackers.agency.model.Project;
import com.bagpackers.agency.model.DeveloperProfile;
import com.bagpackers.agency.model.AdminAction;
import com.bagpackers.agency.model.PortfolioItem;
import com.bagpackers.agency.model.Notification;
import com.bagpackers.agency.repository.ProjectRepository;
import com.bagpackers.agency.repository.DeveloperProfileRepository;
import com.bagpackers.agency.repository.AdminActionRepository;
import com.bagpackers.agency.repository.PortfolioItemRepository;
import com.bagpackers.agency.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectWorkflowService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectWorkflowService.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DeveloperProfileRepository developerProfileRepository;

    @Autowired
    private AdminActionRepository adminActionRepository;

    @Autowired
    private PortfolioItemRepository portfolioItemRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public boolean isValidTransition(String oldStatus, String newStatus) {
        if (oldStatus == null) return false;
        if (oldStatus.equals(newStatus)) return true;

        switch (oldStatus) {
            case "submitted":
                return "in_review".equals(newStatus);
            case "in_review":
                return "open_for_bids".equals(newStatus) || "archived".equals(newStatus);
            case "open_for_bids":
                return "assigned".equals(newStatus);
            case "assigned":
                return "in_progress".equals(newStatus);
            case "in_progress":
                return "completed".equals(newStatus);
            case "completed":
                return "archived".equals(newStatus);
            default:
                return false;
        }
    }

    @Transactional
    public Project transitionProjectStatus(UUID projectId, String newStatus, UUID developerId, UUID adminId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + projectId));

        String oldStatus = project.getStatus();

        if (!isValidTransition(oldStatus, newStatus)) {
            throw new IllegalStateException("Invalid state machine transition from " + oldStatus + " to " + newStatus);
        }

        project.setStatus(newStatus);

        if (developerId != null) {
            project.setAssignedDeveloperId(developerId);
        }

        Project savedProject = projectRepository.save(project);

        // Record admin audit action if admin context is provided
        if (adminId != null) {
            AdminAction action = new AdminAction(adminId, "transition_project_" + newStatus, "projects", projectId);
            adminActionRepository.save(action);
        }

        // Trigger user notification alerts
        try {
            // Notify client of transition
            Notification clientNotice = new Notification(
                project.getClientId(),
                "Project Status Updated",
                "Your project '" + project.getProjectName() + "' transitioned to " + newStatus.replace("_", " ") + "."
            );
            notificationRepository.save(clientNotice);

            // Notify developer if assigned
            if (project.getAssignedDeveloperId() != null) {
                Notification devNotice = new Notification(
                    project.getAssignedDeveloperId(),
                    "Project Assignment Alert",
                    "You have been assigned or updated on project '" + project.getProjectName() + "'. Current status: " + newStatus.replace("_", " ") + "."
                );
                notificationRepository.save(devNotice);
            }
        } catch (Exception e) {
            logger.warn("Non-blocking failure creating project status change notifications.", e);
        }

        logger.info("DOMAIN_EVENT: Project ID {} transitioned from status {} to {} by Admin ID {}",
                projectId, oldStatus, newStatus, adminId);

        return savedProject;
    }

    @Transactional
    public DeveloperProfile verifyDeveloper(UUID developerId, String status, UUID adminId) {
        DeveloperProfile profile = developerProfileRepository.findById(developerId)
                .orElseThrow(() -> new IllegalArgumentException("Developer profile not found with ID: " + developerId));

        if (!"verified".equals(status) && !"rejected".equals(status)) {
            throw new IllegalArgumentException("Invalid verification status: " + status);
        }

        profile.setVerificationStatus(status);
        profile.setPublic("verified".equals(status));

        DeveloperProfile savedProfile = developerProfileRepository.save(profile);

        // Record admin audit action
        if (adminId != null) {
            AdminAction action = new AdminAction(adminId, "verify_developer_" + status, "developer_profiles", developerId);
            adminActionRepository.save(action);
        }

        // Trigger user notification alert
        try {
            Notification notice = new Notification(
                developerId,
                "Profile Verification Audit Completed",
                "Your candidate developer profile verification status has been marked as: " + status.toUpperCase() + "."
            );
            notificationRepository.save(notice);
        } catch (Exception e) {
            logger.warn("Non-blocking failure creating developer verification notifications.", e);
        }

        logger.info("DOMAIN_EVENT: Developer ID {} marked as {} by Admin ID {}",
                developerId, status, adminId);

        return savedProfile;
    }

    @Transactional
    public Project completeAndPublishProject(UUID projectId, String title, String summary, String coverImageUrl, List<String> galleryUrls, List<String> techUsed, UUID adminId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + projectId));

        project.setStatus("archived");
        project.setPortfolioReady(true);
        Project savedProject = projectRepository.save(project);

        PortfolioItem item = new PortfolioItem(projectId, title, summary, coverImageUrl, galleryUrls, techUsed);
        portfolioItemRepository.save(item);

        // Record admin action
        if (adminId != null) {
            AdminAction action = new AdminAction(adminId, "complete_and_publish_project", "projects", projectId);
            adminActionRepository.save(action);
        }

        // Trigger user notification alerts
        try {
            Notification notice = new Notification(
                project.getClientId(),
                "Project Case Study Published",
                "A custom case study for '" + project.getProjectName() + "' was successfully generated and published to the public showcase catalog."
            );
            notificationRepository.save(notice);
        } catch (Exception e) {
            logger.warn("Non-blocking failure creating complete & publish notifications.", e);
        }

        logger.info("DOMAIN_EVENT: Project ID {} was completed and published as a portfolio item by Admin ID {}", projectId, adminId);

        return savedProject;
    }
}
