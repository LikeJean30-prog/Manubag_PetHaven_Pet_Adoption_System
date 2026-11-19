package com.pethaven.backend.service;

import com.pethaven.backend.dto.ShelterSummaryResponse;
import com.pethaven.backend.dto.VerificationDecisionRequest;
import com.pethaven.backend.entity.Shelter;
import com.pethaven.backend.entity.VerificationStatus;
import com.pethaven.backend.exception.BusinessRuleException;
import com.pethaven.backend.repository.ShelterRepository;
import com.pethaven.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class AdminShelterService {

    private final ShelterRepository shelterRepository;
    private final UserRepository userRepository;

    public AdminShelterService(ShelterRepository shelterRepository, UserRepository userRepository) {
        this.shelterRepository = shelterRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ShelterSummaryResponse> listByStatus(VerificationStatus status) {
        return shelterRepository.findByVerificationStatus(status).stream()
                .map(ShelterSummaryResponse::from)
                .toList();
    }

    @Transactional
    public ShelterSummaryResponse decide(Long shelterId, Long adminId, VerificationDecisionRequest req) {
        Shelter shelter = shelterRepository.findById(shelterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shelter not found."));

        if (shelter.getVerificationStatus() != VerificationStatus.PENDING) {
            throw new BusinessRuleException("decision", "This shelter has already been reviewed.");
        }
        if (req.decision() == VerificationStatus.PENDING) {
            throw new BusinessRuleException("decision", "Choose VERIFIED or REJECTED.");
        }
        boolean rejecting = req.decision() == VerificationStatus.REJECTED;
        if (rejecting && (req.reason() == null || req.reason().isBlank())) {
            throw new BusinessRuleException("reason", "A reason is required when rejecting a shelter.");
        }

        shelter.setVerificationStatus(req.decision());
        shelter.setVerifiedBy(userRepository.getReferenceById(adminId));
        shelter.setVerifiedAt(Instant.now());
        shelter.setRejectionReason(rejecting ? req.reason().trim() : null);

        return ShelterSummaryResponse.from(shelter);
    }
}