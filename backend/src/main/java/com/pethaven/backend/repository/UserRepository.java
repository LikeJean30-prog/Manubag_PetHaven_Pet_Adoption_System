package com.pethaven.backend.repository;

import com.pethaven.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);   // used by login (FR-003)

    boolean existsByEmail(String email);        // unique-email check at registration (FR-001)
}