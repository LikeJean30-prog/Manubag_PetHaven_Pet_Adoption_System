package com.pethaven.backend.controller;

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

    @PostMapping("/register/adopter")          // section 8.4, FR-001
    public ResponseEntity<UserResponse> registerAdopter(@Valid @RequestBody RegisterAdopterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponse.from(authService.registerAdopter(req)));
    }
}