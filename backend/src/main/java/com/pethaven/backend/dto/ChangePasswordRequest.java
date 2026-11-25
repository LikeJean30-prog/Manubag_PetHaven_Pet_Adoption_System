package com.pethaven.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangePasswordRequest(
    @NotBlank(message = "Current password is required.")
    String currentPassword,

    @NotBlank(message = "New password is required.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$",
            message = "Password must be at least 8 characters and include a letter and a number.")
    String newPassword,

    @NotBlank(message = "Please confirm your new password.")
    String confirmNewPassword
) {}