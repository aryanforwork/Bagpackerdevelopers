package com.bagpackers.agency.repository;

import com.bagpackers.agency.model.DeveloperProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface DeveloperProfileRepository extends JpaRepository<DeveloperProfile, UUID> {
    List<DeveloperProfile> findByVerificationStatus(String verificationStatus);
}
