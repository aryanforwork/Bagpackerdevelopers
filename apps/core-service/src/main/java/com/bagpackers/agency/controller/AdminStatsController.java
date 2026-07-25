package com.bagpackers.agency.controller;

import com.bagpackers.agency.model.AiIdpSandboxLog;
import com.bagpackers.agency.model.Enquiry;
import com.bagpackers.agency.model.LeadConversion;
import com.bagpackers.agency.repository.AiIdpSandboxLogRepository;
import com.bagpackers.agency.repository.EnquiryRepository;
import com.bagpackers.agency.repository.LeadConversionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/stats")
public class AdminStatsController {

    private final EnquiryRepository enquiryRepository;
    private final LeadConversionRepository leadConversionRepository;
    private final AiIdpSandboxLogRepository aiIdpSandboxLogRepository;

    public AdminStatsController(
            EnquiryRepository enquiryRepository,
            LeadConversionRepository leadConversionRepository,
            AiIdpSandboxLogRepository aiIdpSandboxLogRepository
    ) {
        this.enquiryRepository = enquiryRepository;
        this.leadConversionRepository = leadConversionRepository;
        this.aiIdpSandboxLogRepository = aiIdpSandboxLogRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();

        // Aggregated Metrics
        long totalEnquiries = enquiryRepository.count();
        long totalLeads = leadConversionRepository.count();
        double totalRoiSaved = leadConversionRepository.sumProjectedRoi();
        long totalSandboxRuns = aiIdpSandboxLogRepository.count();
        double avgSandboxTimeMs = aiIdpSandboxLogRepository.getAverageExecutionTimeMs();

        stats.put("totalEnquiries", totalEnquiries);
        stats.put("totalLeads", totalLeads);
        stats.put("totalRoiSaved", totalRoiSaved);
        stats.put("totalSandboxRuns", totalSandboxRuns);
        stats.put("avgSandboxTimeMs", Math.round(avgSandboxTimeMs * 100.0) / 100.0); // round to 2 decimals

        // Recent lists (limit to 10 entries)
        List<Enquiry> recentEnquiries = enquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream().limit(10).collect(Collectors.toList());
        List<LeadConversion> recentLeads = leadConversionRepository.findAllByOrderByCreatedAtDesc()
                .stream().limit(10).collect(Collectors.toList());
        List<AiIdpSandboxLog> recentSandboxLogs = aiIdpSandboxLogRepository.findAllByOrderByCreatedAtDesc()
                .stream().limit(10).collect(Collectors.toList());

        stats.put("recentEnquiries", recentEnquiries);
        stats.put("recentLeads", recentLeads);
        stats.put("recentSandboxLogs", recentSandboxLogs);

        return ResponseEntity.ok(stats);
    }
}
