package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.LeadConversion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface LeadConversionRepository extends JpaRepository<LeadConversion, UUID> {
    List<LeadConversion> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(l.projectedRoi), 0.0) FROM LeadConversion l")
    double sumProjectedRoi();
}
