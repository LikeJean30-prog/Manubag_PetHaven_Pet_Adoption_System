package com.pethaven.backend.controller;

import com.pethaven.backend.dto.LoginRequest;
import com.pethaven.backend.dto.LoginResponse;
import com.pethaven.backend.dto.RegisterAdopterRequest;
import com.pethaven.backend.dto.UserResponse;
import com.pethaven.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/adopter")          // FR-001
    public ResponseEntity<UserResponse> registerAdopter(@Valid @RequestBody RegisterAdopterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponse.from(authService.registerAdopter(req)));
    }

    @PostMapping("/login")                     // FR-003
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}