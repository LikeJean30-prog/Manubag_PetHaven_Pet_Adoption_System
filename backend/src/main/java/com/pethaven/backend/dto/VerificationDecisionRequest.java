package com.pethaven.backend.dto;

import com.pethaven.backend.entity.VerificationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VerificationDecisionRequest(
    @NotNull(message = "Choose a decision: VERIFIED or REJECTED.")
    VerificationStatus decision,

    @Size(max = 500, message = "Reason must be 500 characters or fewer.")
    String reason
) {}