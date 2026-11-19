package com.pethaven.backend.dto;

import com.pethaven.backend.entity.Shelter;

public record ShelterRegistrationResponse(Long userId, Long shelterId, String email,
                                          String organizationName, String organizationType,
                                          String verificationStatus, String message) {

    public static ShelterRegistrationResponse from(Shelter s) {
        return new ShelterRegistrationResponse(
                s.getUser().getUserId(), s.getShelterId(), s.getUser().getEmail(),
                s.getOrganizationName(), s.getOrganizationType().name(),
                s.getVerificationStatus().name(),
                "Registration received. Your account is awaiting administrator verification.");
    }
}