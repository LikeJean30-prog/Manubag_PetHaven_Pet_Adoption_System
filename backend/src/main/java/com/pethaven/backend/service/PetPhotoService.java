package com.pethaven.backend.service;

import com.pethaven.backend.dto.PetResponse;
import com.pethaven.backend.entity.Pet;
import com.pethaven.backend.entity.PetPhoto;
import com.pethaven.backend.entity.Shelter;
import com.pethaven.backend.entity.VerificationStatus;
import com.pethaven.backend.exception.BusinessRuleException;
import com.pethaven.backend.repository.PetRepository;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PetPhotoService {

    public static final int MAX_PHOTOS = 5;
    private static final long MAX_BYTES = 5L * 1024 * 1024;

    private final PetRepository petRepository;
    private final CloudinaryService cloudinary;

    public PetPhotoService(PetRepository petRepository, CloudinaryService cloudinary) {
        this.petRepository = petRepository;
        this.cloudinary = cloudinary;
    }

    @Transactional
    public PetResponse addPhotos(Long userId, Long petId, List<MultipartFile> files) {
        Pet pet = findOwnPet(userId, petId);
        requireVerified(pet.getShelter());

        List<MultipartFile> chosen = files == null ? List.of()
                : files.stream().filter(f -> !f.isEmpty()).toList();
        if (chosen.isEmpty()) {
            throw new BusinessRuleException("files", "Choose at least one photo.");
        }

        int remaining = MAX_PHOTOS - pet.getPhotos().size();
        if (chosen.size() > remaining) {
            throw new BusinessRuleException("files", remaining == 0
                    ? "This pet already has 5 photos. Delete one before adding another."
                    : "A pet can have at most 5 photos. You can add " + remaining + " more.");
        }

        List<byte[]> contents = new ArrayList<>();
        for (MultipartFile file : chosen) {
            String name = file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo";
            if (file.getSize() > MAX_BYTES) {
                throw new BusinessRuleException("files", "\"" + name + "\" is larger than 5 MB.");
            }
            byte[] bytes;
            try {
                bytes = file.getBytes();
            } catch (IOException e) {
                throw new BusinessRuleException("files", "Could not read \"" + name + "\". Please try again.");
            }
            if (!isAllowedImage(bytes)) {
                throw new BusinessRuleException("files", "\"" + name + "\" is not a JPEG, PNG or WebP image.");
            }
            contents.add(bytes);
        }

        boolean hasPrimary = pet.getPhotos().stream().anyMatch(PetPhoto::isPrimaryPhoto);
        List<String> uploadedIds = new ArrayList<>();
        try {
            for (int i = 0; i < contents.size(); i++) {
                CloudinaryService.UploadResult result =
                        cloudinary.upload(contents.get(i), chosen.get(i).getOriginalFilename());
                uploadedIds.add(result.publicId());
                pet.getPhotos().add(new PetPhoto(pet, result.secureUrl(), result.publicId(), !hasPrimary && i == 0));
            }
        } catch (RuntimeException e) {
            for (String id : uploadedIds) {
                try {
                    cloudinary.delete(id);
                } catch (RuntimeException ignored) {
                }
            }
            throw e;
        }

        return PetResponse.from(petRepository.saveAndFlush(pet));
    }

    @Transactional
    public PetResponse deletePhoto(Long userId, Long petId, Long photoId) {
        Pet pet = findOwnPet(userId, petId);
        requireVerified(pet.getShelter());
        PetPhoto photo = findPhoto(pet, photoId);

        if (pet.getPhotos().size() <= 1) {
            throw new BusinessRuleException("photos",
                    "A pet must keep at least one photo. Add another photo before deleting this one.");
        }

        cloudinary.delete(photo.getPublicId());
        pet.getPhotos().remove(photo);
        if (photo.isPrimaryPhoto()) {
            pet.getPhotos().get(0).setPrimaryPhoto(true);
        }
        return PetResponse.from(petRepository.saveAndFlush(pet));
    }

    @Transactional
    public PetResponse setPrimary(Long userId, Long petId, Long photoId) {
        Pet pet = findOwnPet(userId, petId);
        requireVerified(pet.getShelter());
        PetPhoto chosen = findPhoto(pet, photoId);

        pet.getPhotos().forEach(p -> p.setPrimaryPhoto(p == chosen));
        return PetResponse.from(petRepository.saveAndFlush(pet));
    }

    private PetPhoto findPhoto(Pet pet, Long photoId) {
        return pet.getPhotos().stream()
                .filter(p -> p.getPhotoId().equals(photoId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found."));
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
        if (shelter.getVerificationStatus() != VerificationStatus.VERIFIED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Your shelter must be verified before you can manage pet photos.");
        }
    }

    private static boolean isAllowedImage(byte[] b) {
        boolean jpeg = b.length >= 3
                && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF;
        boolean png = b.length >= 8
                && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G'
                && b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A;
        boolean webp = b.length >= 12
                && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
        return jpeg || png || webp;
    }
}