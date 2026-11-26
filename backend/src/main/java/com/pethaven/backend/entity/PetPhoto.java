package com.pethaven.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pet_photo")
public class PetPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "secure_url", nullable = false, length = 500)
    private String secureUrl;

    @Column(name = "public_id", nullable = false, length = 255)
    private String publicId;

    @Column(name = "is_primary", nullable = false)
    private boolean primaryPhoto;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected PetPhoto() {
    }

    public PetPhoto(Pet pet, String secureUrl, String publicId, boolean primaryPhoto) {
        this.pet = pet;
        this.secureUrl = secureUrl;
        this.publicId = publicId;
        this.primaryPhoto = primaryPhoto;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public Long getPhotoId() { return photoId; }
    public Pet getPet() { return pet; }
    public String getSecureUrl() { return secureUrl; }
    public String getPublicId() { return publicId; }
    public boolean isPrimaryPhoto() { return primaryPhoto; }
    public Instant getCreatedAt() { return createdAt; }

    public void setPrimaryPhoto(boolean primaryPhoto) { this.primaryPhoto = primaryPhoto; }
}