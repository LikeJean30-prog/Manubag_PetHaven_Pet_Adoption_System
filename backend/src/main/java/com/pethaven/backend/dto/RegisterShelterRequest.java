package com.pethaven.backend.dto;

import com.pethaven.backend.entity.OrganizationType;
import jakarta.validation.constraints.*;

public record RegisterShelterRequest(

    @NotBlank(message = "Organization name is required.")
    @Size(max = 150, message = "Organization name must be 150 characters or fewer.")
    String organizationName,

    @NotNull(message = "Choose an organization type: SHELTER or RESCUER.")
    OrganizationType organizationType,

    @NotBlank(message = "Contact person's first name is required.")
    @Size(max = 100, message = "First name must be 100 characters or fewer.")
    String contactFirstName,

    @NotBlank(message = "Contact person's last name is required.")
    @Size(max = 100, message = "Last name must be 100 characters or fewer.")
    String contactLastName,

    @NotBlank(message = "Email is required.")
    @Email(message = "Enter a valid email address, like name@example.com.")
    String email,

    @NotBlank(message = "Phone number is required.")
    @Size(max = 20, message = "Phone number must be 20 characters or fewer.")
    String phoneNumber,

    @NotBlank(message = "Address is required.")
    @Size(max = 255, message = "Address must be 255 characters or fewer.")
    String address,

    @Size(max = 1000, message = "Description must be 1,000 characters or fewer.")
    String description,

    @NotBlank(message = "Password is required.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$",
             message = "Password must be at least 8 characters and include a letter and a number.")
    String password,

    @AssertTrue(message = "You must agree to the privacy notice to register.")
    boolean privacyConsent
) {}