package com.pethaven.backend.dto;

import com.pethaven.backend.entity.PetPhoto;

public record PhotoResponse(Long photoId, String url, boolean primary) {

    public static PhotoResponse from(PetPhoto photo) {
        return new PhotoResponse(photo.getPhotoId(), photo.getSecureUrl(), photo.isPrimaryPhoto());
    }
}