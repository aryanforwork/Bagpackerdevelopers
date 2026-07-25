package com.bagpackers.agency.controller;

import com.bagpackers.agency.model.Project;
import com.bagpackers.agency.model.Profile;
import com.bagpackers.agency.model.DeveloperProfile;
import com.bagpackers.agency.model.AdminAction;
import com.bagpackers.agency.model.ProjectInterest;
import com.bagpackers.agency.model.PortfolioItem;
import com.bagpackers.agency.model.Notification;
import com.bagpackers.agency.model.ProjectMessage;
import com.bagpackers.agency.model.ProjectReview;
import com.bagpackers.agency.repository.ProjectRepository;
import com.bagpackers.agency.repository.ProfileRepository;
import com.bagpackers.agency.repository.DeveloperProfileRepository;
import com.bagpackers.agency.repository.AdminActionRepository;
import com.bagpackers.agency.repository.ProjectInterestRepository;
import com.bagpackers.agency.repository.PortfolioItemRepository;
import com.bagpackers.agency.repository.NotificationRepository;
import com.bagpackers.agency.repository.ProjectMessageRepository;
import com.bagpackers.agency.repository.ProjectReviewRepository;
import com.bagpackers.agency.service.ProjectWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/internal")
public class ProjectWorkflowController {

    @Autowired
    private ProjectWorkflowService projectWorkflowService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private DeveloperProfileRepository developerProfileRepository;

    @Autowired
    private AdminActionRepository adminActionRepository;

    @Autowired
    private ProjectInterestRepository projectInterestRepository;

    @Autowired
    private PortfolioItemRepository portfolioItemRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ProjectMessageRepository projectMessageRepository;

    @Autowired
    private ProjectReviewRepository projectReviewRepository;

    @PostMapping("/projects/{id}/transition")
    public ResponseEntity<?> transitionProject(
            @PathVariable("id") UUID projectId,
            @RequestParam("status") String status,
            @RequestParam(value = "developerId", required = false) UUID developerId,
            @RequestParam(value = "adminId", required = false) UUID adminId) {
        try {
            Project updatedProject = projectWorkflowService.transitionProjectStatus(projectId, status, developerId, adminId);
            return ResponseEntity.ok(updatedProject);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/developers/{id}/verify")
    public ResponseEntity<?> verifyDeveloper(
            @PathVariable("id") UUID developerId,
            @RequestParam("status") String status,
            @RequestParam(value = "adminId", required = false) UUID adminId) {
        try {
            DeveloperProfile updatedProfile = projectWorkflowService.verifyDeveloper(developerId, status, adminId);
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping("/projects")
    public ResponseEntity<Page<Project>> listProjects(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Project> projectsPage;

        if (status != null && !status.isEmpty() && !"all".equalsIgnoreCase(status)) {
            projectsPage = projectRepository.findByStatus(status, pageable);
        } else {
            projectsPage = projectRepository.findAll(pageable);
        }

        return ResponseEntity.ok(projectsPage);
    }

    @GetMapping("/developers")
    public ResponseEntity<List<Profile>> listDevelopers() {
        List<Profile> developers = profileRepository.findByRole("developer");
        return ResponseEntity.ok(developers);
    }

    @GetMapping("/projects/{id}/interests")
    public ResponseEntity<List<ProjectInterest>> listProjectInterests(@PathVariable("id") UUID projectId) {
        List<ProjectInterest> interests = projectInterestRepository.findByProjectId(projectId);
        return ResponseEntity.ok(interests);
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long pendingDevs = developerProfileRepository.findByVerificationStatus("pending").size();
        long inReviewProjects = projectRepository.findByStatus("in_review", PageRequest.of(0, 1)).getTotalElements();
        long openProjects = projectRepository.findByStatus("open_for_bids", PageRequest.of(0, 1)).getTotalElements();
        long activeBuilds = projectRepository.findByStatus("in_progress", PageRequest.of(0, 1)).getTotalElements();

        stats.put("pendingDevelopers", pendingDevs);
        stats.put("projectsInReview", inReviewProjects);
        stats.put("openProjects", openProjects);
        stats.put("activeBuilds", activeBuilds);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/admin/audit-logs")
    public ResponseEntity<List<AdminAction>> getAdminAuditLogs() {
        List<AdminAction> logs = adminActionRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/projects/{id}/complete-and-publish")
    public ResponseEntity<?> completeAndPublishProject(
            @PathVariable("id") UUID projectId,
            @RequestParam("title") String title,
            @RequestParam("summary") String summary,
            @RequestParam("coverImageUrl") String coverImageUrl,
            @RequestParam("galleryUrls") List<String> galleryUrls,
            @RequestParam("techUsed") List<String> techUsed,
            @RequestParam(value = "adminId", required = false) UUID adminId) {
        try {
            Project project = projectWorkflowService.completeAndPublishProject(
                projectId, title, summary, coverImageUrl, galleryUrls, techUsed, adminId
            );
            return ResponseEntity.ok(project);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/portfolio")
    public ResponseEntity<List<PortfolioItem>> listPortfolioItems() {
        return ResponseEntity.ok(portfolioItemRepository.findAllByOrderByPublishedAtDesc());
    }

    // Phase 9: Project message threads
    @GetMapping("/projects/{id}/messages")
    public ResponseEntity<List<ProjectMessage>> getProjectMessages(@PathVariable("id") UUID projectId) {
        return ResponseEntity.ok(projectMessageRepository.findByProjectIdOrderByCreatedAtAsc(projectId));
    }

    @PostMapping("/projects/{id}/messages")
    public ResponseEntity<ProjectMessage> sendProjectMessage(
            @PathVariable("id") UUID projectId,
            @RequestParam("senderId") UUID senderId,
            @RequestParam("message") String message) {
        
        ProjectMessage msg = new ProjectMessage(projectId, senderId, message);
        ProjectMessage savedMsg = projectMessageRepository.save(msg);
        
        // Notify matching project participant (client/developer) of new message
        try {
            Project project = projectRepository.findById(projectId).orElse(null);
            if (project != null) {
                UUID recipientId = senderId.equals(project.getClientId()) 
                    ? project.getAssignedDeveloperId() 
                    : project.getClientId();

                if (recipientId != null) {
                    Notification notice = new Notification(
                        recipientId,
                        "New Message In Project Hub",
                        "You received a new message in project '" + project.getProjectName() + "'."
                    );
                    notificationRepository.save(notice);
                }
            }
        } catch (Exception e) {
            // non-blocking
        }

        return ResponseEntity.ok(savedMsg);
    }

    // Phase 9: Project reviews and client ratings
    @PostMapping("/projects/{id}/review")
    public ResponseEntity<?> submitProjectReview(
            @PathVariable("id") UUID projectId,
            @RequestParam("clientId") UUID clientId,
            @RequestParam("developerId") UUID developerId,
            @RequestParam("rating") int rating,
            @RequestParam("reviewText") String reviewText) {
        
        ProjectReview review = new ProjectReview(projectId, clientId, developerId, rating, reviewText);
        ProjectReview savedReview = projectReviewRepository.save(review);
        
        // Notify developer of new review
        try {
            Notification notice = new Notification(
                developerId,
                "New Client Review Received",
                "You received a " + rating + "-star rating and feedback on a completed project build."
            );
            notificationRepository.save(notice);
        } catch (Exception e) {
            // non-blocking
        }

        return ResponseEntity.ok(savedReview);
    }

    // Phase 9: User notifications lists
    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> listNotifications(@RequestParam("userId") UUID userId) {
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @PostMapping("/notifications/{id}/read")
    public ResponseEntity<?> markNotificationRead(@PathVariable("id") UUID notificationId) {
        Notification notice = notificationRepository.findById(notificationId).orElse(null);
        if (notice != null) {
            notice.setRead(true);
            notificationRepository.save(notice);
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.status(404).body("Notification not found.");
    }
}
