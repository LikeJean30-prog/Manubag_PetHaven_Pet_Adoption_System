package com.pethaven.backend.controller;

import com.pethaven.backend.dto.UserResponse;
import com.pethaven.backend.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
}