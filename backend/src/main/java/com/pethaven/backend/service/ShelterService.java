package com.pethaven.backend.service;

import com.pethaven.backend.dto.ShelterSummaryResponse;
import com.pethaven.backend.repository.ShelterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;

    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    @Transactional(readOnly = true)
    public ShelterSummaryResponse getMyShelter(Long userId) {
        return shelterRepository.findByUser_UserId(userId)
                .map(ShelterSummaryResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shelter profile not found."));
    }
}