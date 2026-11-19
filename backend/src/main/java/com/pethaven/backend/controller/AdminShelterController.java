package com.pethaven.backend.controller;

import com.pethaven.backend.dto.ShelterSummaryResponse;
import com.pethaven.backend.dto.VerificationDecisionRequest;
import com.pethaven.backend.entity.VerificationStatus;
import com.pethaven.backend.service.AdminShelterService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/shelters")
public class AdminShelterController {

    private final AdminShelterService adminShelterService;

    public AdminShelterController(AdminShelterService adminShelterService) {
        this.adminShelterService = adminShelterService;
    }

    @GetMapping
    public List<ShelterSummaryResponse> list(@RequestParam(defaultValue = "PENDING") VerificationStatus status) {
        return adminShelterService.listByStatus(status);
    }

    @PatchMapping("/{id}/verification")
    public ShelterSummaryResponse decide(@PathVariable Long id,
                                         @AuthenticationPrincipal Long adminId,
                                         @Valid @RequestBody VerificationDecisionRequest req) {
        return adminShelterService.decide(id, adminId, req);
    }
}