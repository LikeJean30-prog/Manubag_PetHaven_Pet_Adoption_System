package com.pethaven.backend.controller;

import com.pethaven.backend.dto.ShelterSummaryResponse;
import com.pethaven.backend.dto.UpdateShelterProfileRequest;
import com.pethaven.backend.service.ShelterService;
import jakarta.validation.Valid;
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

    @PutMapping("/me")                           // FR-007: organization details and address
    public ShelterSummaryResponse updateMe(@AuthenticationPrincipal Long userId,
                                        @Valid @RequestBody UpdateShelterProfileRequest req) {
        return shelterService.updateMyShelter(userId, req);
    }
}