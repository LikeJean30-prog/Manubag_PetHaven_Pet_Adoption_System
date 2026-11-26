package com.pethaven.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pet")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_id")
    private Long petId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shelter_id", nullable = false)
    private Shelter shelter;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Species species;

    @Column(nullable = false, length = 100)
    private String breed;

    @Column(name = "age_months", nullable = false)
    private Integer ageMonths;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PetSex sex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PetSize size;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "vaccination_status", nullable = false, length = 30)
    private VaccinationStatus vaccinationStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PetStatus status = PetStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "moderation_status", nullable = false, length = 20)
    private ModerationStatus moderationStatus = ModerationStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("primaryPhoto DESC, photoId ASC")
    private List<PetPhoto> photos = new ArrayList<>();

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getPetId() { return petId; }
    public Shelter getShelter() { return shelter; }
    public String getName() { return name; }
    public Species getSpecies() { return species; }
    public String getBreed() { return breed; }
    public Integer getAgeMonths() { return ageMonths; }
    public PetSex getSex() { return sex; }
    public PetSize getSize() { return size; }
    public String getDescription() { return description; }
    public VaccinationStatus getVaccinationStatus() { return vaccinationStatus; }
    public PetStatus getStatus() { return status; }
    public ModerationStatus getModerationStatus() { return moderationStatus; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<PetPhoto> getPhotos() { return photos; }

    public void setShelter(Shelter shelter) { this.shelter = shelter; }
    public void setName(String name) { this.name = name; }
    public void setSpecies(Species species) { this.species = species; }
    public void setBreed(String breed) { this.breed = breed; }
    public void setAgeMonths(Integer ageMonths) { this.ageMonths = ageMonths; }
    public void setSex(PetSex sex) { this.sex = sex; }
    public void setSize(PetSize size) { this.size = size; }
    public void setDescription(String description) { this.description = description; }
    public void setVaccinationStatus(VaccinationStatus vaccinationStatus) { this.vaccinationStatus = vaccinationStatus; }
    public void setStatus(PetStatus status) { this.status = status; }
    public void setModerationStatus(ModerationStatus moderationStatus) { this.moderationStatus = moderationStatus; }
}