package com.pethaven.backend.controller;

import com.pethaven.backend.dto.ShelterSummaryResponse;
import com.pethaven.backend.service.ShelterService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shelter")
public class ShelterController {

    private final ShelterService shelterService;

    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @GetMapping("/me")
    public ShelterSummaryResponse me(@AuthenticationPrincipal Long userId) {
        return shelterService.getMyShelter(userId);
    }
}