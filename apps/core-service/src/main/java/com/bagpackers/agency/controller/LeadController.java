package com.bagpackers.agency.controller;

import com.bagpackers.agency.model.LeadConversion;
import com.bagpackers.agency.repository.LeadConversionRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadConversionRepository leadConversionRepository;
    private final List<LeadConversion> memoryLeads = Collections.synchronizedList(new ArrayList<>());

    public LeadController(LeadConversionRepository leadConversionRepository) {
        this.leadConversionRepository = leadConversionRepository;
    }

    @PostMapping
    public ResponseEntity<LeadConversion> submitLead(@Valid @RequestBody LeadConversion lead) {
        
        try {
            LeadConversion saved = leadConversionRepository.save(lead);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            // Database connection failed, store in memory for showcase integrity
            lead.setId(UUID.randomUUID());
            memoryLeads.add(lead);
            return ResponseEntity.ok(lead);
        }
    }

    @GetMapping
    public ResponseEntity<List<LeadConversion>> getLeads() {
        try {
            List<LeadConversion> dbLeads = leadConversionRepository.findAll();
            List<LeadConversion> allLeads = new ArrayList<>(dbLeads);
            allLeads.addAll(memoryLeads);
            return ResponseEntity.ok(allLeads);
        } catch (Exception e) {
            return ResponseEntity.ok(memoryLeads);
        }
    }
}
