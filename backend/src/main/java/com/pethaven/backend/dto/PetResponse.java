package com.pethaven.backend.dto;

import com.pethaven.backend.entity.*;
import java.time.Instant;
import java.util.List;

public record PetResponse(
        Long petId,
        String name,
        Species species,
        String breed,
        Integer ageMonths,
        PetSex sex,
        PetSize size,
        String description,
        VaccinationStatus vaccinationStatus,
        PetStatus status,
        ModerationStatus moderationStatus,
        Long shelterId,
        String shelterName,
        Instant createdAt,
        Instant updatedAt,
        String primaryPhotoUrl,
        List<PhotoResponse> photos
) {
    public static PetResponse from(Pet p) {
        List<PhotoResponse> photos = p.getPhotos().stream().map(PhotoResponse::from).toList();
        String primaryUrl = photos.stream()
                .filter(PhotoResponse::primary)
                .map(PhotoResponse::url)
                .findFirst()
                .orElse(photos.isEmpty() ? null : photos.get(0).url());

        return new PetResponse(
                p.getPetId(), p.getName(), p.getSpecies(), p.getBreed(), p.getAgeMonths(),
                p.getSex(), p.getSize(), p.getDescription(), p.getVaccinationStatus(),
                p.getStatus(), p.getModerationStatus(),
                p.getShelter().getShelterId(), p.getShelter().getOrganizationName(),
                p.getCreatedAt(), p.getUpdatedAt(),
                primaryUrl, photos);
    }
}