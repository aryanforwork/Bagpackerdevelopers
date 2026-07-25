package com.bagpackers.agency.controller;

import com.bagpackers.agency.model.Enquiry;
import com.bagpackers.agency.repository.EnquiryRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enquiries")
public class EnquiryController {

    private final EnquiryRepository enquiryRepository;

    public EnquiryController(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    @PostMapping
    public ResponseEntity<Enquiry> submitEnquiry(@Valid @RequestBody Enquiry enquiry) {
        // Manual validation checks to ensure precise error messages
        if (enquiry.getName() == null || enquiry.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (enquiry.getEmail() == null || enquiry.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (enquiry.getBrief() == null || enquiry.getBrief().trim().isEmpty()) {
            throw new IllegalArgumentException("Brief is required");
        }
        if (!enquiry.getEmail().contains("@") || enquiry.getEmail().trim().length() < 3) {
            throw new IllegalArgumentException("Invalid email format");
        }

        Enquiry saved = enquiryRepository.save(enquiry);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Enquiry>> getEnquiries() {
        return ResponseEntity.ok(enquiryRepository.findAll());
    }
}
