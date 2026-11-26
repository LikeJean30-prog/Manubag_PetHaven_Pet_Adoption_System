package com.pethaven.backend.service;

import com.pethaven.backend.dto.PetRequest;
import com.pethaven.backend.dto.PetResponse;
import com.pethaven.backend.entity.Pet;
import com.pethaven.backend.entity.Shelter;
import com.pethaven.backend.entity.VerificationStatus;
import com.pethaven.backend.repository.PetRepository;
import com.pethaven.backend.repository.ShelterRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PetService {

    private final PetRepository petRepository;
    private final ShelterRepository shelterRepository;

    public PetService(PetRepository petRepository, ShelterRepository shelterRepository) {
        this.petRepository = petRepository;
        this.shelterRepository = shelterRepository;
    }

    @Transactional(readOnly = true)
    public List<PetResponse> listMine(Long userId) {
        Shelter shelter = findOwnShelter(userId);
        return petRepository.findByShelter_ShelterIdOrderByCreatedAtDesc(shelter.getShelterId())
                .stream().map(PetResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PetResponse getMine(Long userId, Long petId) {
        return PetResponse.from(findOwnPet(userId, petId));
    }

    @Transactional
    public PetResponse create(Long userId, PetRequest req) {
        Shelter shelter = findOwnShelter(userId);
        requireVerified(shelter);

        Pet pet = new Pet();
        pet.setShelter(shelter);
        apply(pet, req);
        return PetResponse.from(petRepository.save(pet));
    }

    @Transactional
    public PetResponse update(Long userId, Long petId, PetRequest req) {
        Pet pet = findOwnPet(userId, petId);
        requireVerified(pet.getShelter());
        apply(pet, req);
        return PetResponse.from(petRepository.saveAndFlush(pet));
    }

    private void apply(Pet pet, PetRequest req) {
        pet.setName(req.name().trim());
        pet.setSpecies(req.species());
        pet.setBreed(req.breed().trim());
        pet.setAgeMonths(req.ageMonths());
        pet.setSex(req.sex());
        pet.setSize(req.size());
        String description = req.description() == null ? "" : req.description().trim();
        pet.setDescription(description.isEmpty() ? null : description);
        pet.setVaccinationStatus(req.vaccinationStatus());
    }

    private Shelter findOwnShelter(Long userId) {
        return shelterRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shelter profile not found."));
    }

    private Pet findOwnPet(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found."));
        if (!pet.getShelter().getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own pet listings.");
        }
        return pet;
    }

    private void requireVerified(Shelter shelter) {
        if (shelter.getVerificationStatus() == VerificationStatus.VERIFIED) {
            return;
        }
        String reason = shelter.getVerificationStatus() == VerificationStatus.REJECTED
                ? "Your shelter registration was not approved, so you cannot create or edit pet listings."
                : "Your shelter is waiting for administrator verification. You can create pet listings once it is verified.";
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, reason);
    }
}