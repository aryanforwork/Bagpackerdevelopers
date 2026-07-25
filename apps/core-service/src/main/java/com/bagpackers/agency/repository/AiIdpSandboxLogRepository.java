package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.AiIdpSandboxLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface AiIdpSandboxLogRepository extends JpaRepository<AiIdpSandboxLog, UUID> {
    List<AiIdpSandboxLog> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(AVG(s.executionTimeMs), 0.0) FROM AiIdpSandboxLog s")
    double getAverageExecutionTimeMs();
}
