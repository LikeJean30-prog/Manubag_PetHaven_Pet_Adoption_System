package com.pethaven.backend.controller;

import com.pethaven.backend.dto.ChangePasswordRequest;
import com.pethaven.backend.dto.UpdateProfileRequest;
import com.pethaven.backend.dto.UserResponse;
import com.pethaven.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map; 
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")                                   // section 8.4: Any role, FR-007
    public UserResponse me(@AuthenticationPrincipal Long userId) {
        return UserResponse.from(userService.getById(userId));
    }

    @PutMapping("/me")                                    // section 8.4, FR-007
    public UserResponse updateMe(@AuthenticationPrincipal Long userId,
                                @Valid @RequestBody UpdateProfileRequest req) {
        return UserResponse.from(userService.updateProfile(userId, req));
    }

    @PutMapping("/me/password")                           // FR-007
    public Map<String, String> changePassword(@AuthenticationPrincipal Long userId,
                                            @Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(userId, req);
        return Map.of("message", "Password changed. Please log in again with your new password.");
    }
    
}