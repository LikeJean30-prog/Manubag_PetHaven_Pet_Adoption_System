package com.pethaven.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// FR-007: name and phone number. Email is the login identity and is not editable here.
public record UpdateProfileRequest(
    @NotBlank(message = "First name is required.")
    @Size(max = 100, message = "First name must be 100 characters or fewer.")
    String firstName,

    @NotBlank(message = "Last name is required.")
    @Size(max = 100, message = "Last name must be 100 characters or fewer.")
    String lastName,

    @NotBlank(message = "Phone number is required.")
    @Size(max = 20, message = "Phone number must be 20 characters or fewer.")
    String phoneNumber
) {}