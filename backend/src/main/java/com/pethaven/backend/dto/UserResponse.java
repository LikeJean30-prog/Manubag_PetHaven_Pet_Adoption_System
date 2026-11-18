package com.pethaven.backend.dto;

import com.pethaven.backend.entity.User;

public record UserResponse(Long userId, String email, String firstName,
                           String lastName, String role, String accountStatus) {

    public static UserResponse from(User u) {
        return new UserResponse(u.getUserId(), u.getEmail(), u.getFirstName(),
                u.getLastName(), u.getRole().name(), u.getAccountStatus().name());
    }
}