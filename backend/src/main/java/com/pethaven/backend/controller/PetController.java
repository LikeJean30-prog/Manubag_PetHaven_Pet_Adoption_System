package com.pethaven.backend.controller;

import com.pethaven.backend.dto.PetRequest;
import com.pethaven.backend.dto.PetResponse;
import com.pethaven.backend.service.PetService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @PostMapping("/api/pets")
    @ResponseStatus(HttpStatus.CREATED)
    public PetResponse create(@AuthenticationPrincipal Long userId, @Valid @RequestBody PetRequest req) {
        return petService.create(userId, req);
    }

    @PutMapping("/api/pets/{petId}")
    public PetResponse update(@AuthenticationPrincipal Long userId, @PathVariable Long petId,
                            @Valid @RequestBody PetRequest req) {
        return petService.update(userId, petId, req);
    }

    @GetMapping("/api/shelter/pets")
    public List<PetResponse> listMine(@AuthenticationPrincipal Long userId) {
        return petService.listMine(userId);
    }

    @GetMapping("/api/shelter/pets/{petId}")
    public PetResponse getMine(@AuthenticationPrincipal Long userId, @PathVariable Long petId) {
        return petService.getMine(userId, petId);
    }
}