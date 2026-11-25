package com.pethaven.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// FR-007: shelters can also update organization details and address
public record UpdateShelterProfileRequest(
    @NotBlank(message = "Organization name is required.")
    @Size(max = 150, message = "Organization name must be 150 characters or fewer.")
    String organizationName,

    @NotBlank(message = "Contact number is required.")
    @Size(max = 20, message = "Contact number must be 20 characters or fewer.")
    String contactNumber,

    @NotBlank(message = "Address is required.")
    @Size(max = 255, message = "Address must be 255 characters or fewer.")
    String address,

    @Size(max = 1000, message = "Description must be 1,000 characters or fewer.")
    String description
) {}