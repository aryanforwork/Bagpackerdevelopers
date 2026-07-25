package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.AdminAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface AdminActionRepository extends JpaRepository<AdminAction, UUID> {
    List<AdminAction> findAllByOrderByCreatedAtDesc();
}
