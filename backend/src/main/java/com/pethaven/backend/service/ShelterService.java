package com.pethaven.backend.service;

import com.pethaven.backend.dto.ShelterSummaryResponse;
import com.pethaven.backend.dto.UpdateShelterProfileRequest;
import com.pethaven.backend.entity.Shelter;
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
                return ShelterSummaryResponse.from(findOwnShelter(userId)); 
    }

    @Transactional
    public ShelterSummaryResponse updateMyShelter(Long userId, UpdateShelterProfileRequest req) {   // FR-007
        Shelter shelter = findOwnShelter(userId);
        shelter.setOrganizationName(req.organizationName().trim());
        shelter.setContactNumber(req.contactNumber().trim());
        shelter.setAddress(req.address().trim());          // geocoding of new addresses comes with FR-040
        shelter.setDescription(req.description() == null || req.description().isBlank()
                ? null : req.description().trim());
        return ShelterSummaryResponse.from(shelter);
    }

    private Shelter findOwnShelter(Long userId) {
        return shelterRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shelter profile not found."));
    }

}