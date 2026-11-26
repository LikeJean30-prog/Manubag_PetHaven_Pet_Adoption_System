package com.pethaven.backend.controller;

import com.pethaven.backend.dto.PetResponse;
import com.pethaven.backend.service.PetPhotoService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pets/{petId}/photos")
public class PetPhotoController {

    private final PetPhotoService petPhotoService;

    public PetPhotoController(PetPhotoService petPhotoService) {
        this.petPhotoService = petPhotoService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PetResponse addPhotos(@AuthenticationPrincipal Long userId, @PathVariable Long petId,
                                 @RequestParam("files") List<MultipartFile> files) {
        return petPhotoService.addPhotos(userId, petId, files);
    }

    @DeleteMapping("/{photoId}")
    public PetResponse deletePhoto(@AuthenticationPrincipal Long userId, @PathVariable Long petId,
                                   @PathVariable Long photoId) {
        return petPhotoService.deletePhoto(userId, petId, photoId);
    }

    @PatchMapping("/{photoId}/primary")
    public PetResponse setPrimary(@AuthenticationPrincipal Long userId, @PathVariable Long petId,
                                  @PathVariable Long photoId) {
        return petPhotoService.setPrimary(userId, petId, photoId);
    }
}