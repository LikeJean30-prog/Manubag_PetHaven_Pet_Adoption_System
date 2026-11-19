package com.pethaven.backend.repository;

import com.pethaven.backend.entity.Shelter;
import com.pethaven.backend.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    Optional<Shelter> findByUser_UserId(Long userId);                   // a shelter's own profile

    List<Shelter> findByVerificationStatus(VerificationStatus status);   // admin pending list (FR-054)
}