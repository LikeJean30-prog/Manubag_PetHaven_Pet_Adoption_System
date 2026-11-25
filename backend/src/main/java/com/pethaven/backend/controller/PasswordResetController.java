package com.pethaven.backend.controller;

import com.pethaven.backend.dto.ForgotPasswordRequest;
import com.pethaven.backend.dto.ResetPasswordRequest;
import com.pethaven.backend.service.PasswordResetService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        passwordResetService.requestReset(req);
        return Map.of("message",
                "We sent a password reset link. It expires in 30 minutes.");
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        passwordResetService.resetPassword(req);
        return Map.of("message", "Your password has been reset. Please log in with your new password.");
    }
}