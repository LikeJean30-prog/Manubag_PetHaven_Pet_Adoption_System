package com.pethaven.backend.dto;

public record LoginResponse(String accessToken, String tokenType, long expiresIn,
                            Long userId, String role) {}