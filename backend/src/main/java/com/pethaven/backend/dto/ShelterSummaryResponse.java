package com.pethaven.backend.dto;

import com.pethaven.backend.entity.Shelter;
import java.time.Instant;

public record ShelterSummaryResponse(Long shelterId, String organizationName, String organizationType,
                                String address, String contactPerson, String email,
                                String contactNumber, String description,
                                String verificationStatus, String rejectionReason,
                                Instant verifiedAt, Instant createdAt) {

    public static ShelterSummaryResponse from(Shelter s) {
        return new ShelterSummaryResponse(
                s.getShelterId(), s.getOrganizationName(), s.getOrganizationType().name(),
                s.getAddress(),
                s.getUser().getFirstName() + " " + s.getUser().getLastName(),
                s.getUser().getEmail(), s.getContactNumber(), s.getDescription(),
                s.getVerificationStatus().name(), s.getRejectionReason(),
                s.getVerifiedAt(), s.getCreatedAt());
    }
}