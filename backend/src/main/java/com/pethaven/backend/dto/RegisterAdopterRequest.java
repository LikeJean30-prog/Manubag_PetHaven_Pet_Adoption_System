package com.pethaven.backend.dto;

import jakarta.validation.constraints.*;

public record RegisterAdopterRequest(

    @NotBlank(message = "First name is required.")
    @Size(max = 100, message = "First name must be 100 characters or fewer.")
    String firstName,

    @NotBlank(message = "Last name is required.")
    @Size(max = 100, message = "Last name must be 100 characters or fewer.")
    String lastName,

    @NotBlank(message = "Email is required.")
    @Email(message = "Enter a valid email address, like name@example.com.")
    String email,

    @NotBlank(message = "Phone number is required.")
    @Size(max = 20, message = "Phone number must be 20 characters or fewer.")
    String phoneNumber,

    @NotBlank(message = "Password is required.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$",
             message = "Password must be at least 8 characters and include a letter and a number.")
    String password,

    @AssertTrue(message = "You must agree to the privacy notice to register.")
    boolean privacyConsent
) {}