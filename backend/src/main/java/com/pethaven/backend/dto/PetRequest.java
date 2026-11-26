package com.pethaven.backend.dto;

import com.pethaven.backend.entity.PetSex;
import com.pethaven.backend.entity.PetSize;
import com.pethaven.backend.entity.Species;
import com.pethaven.backend.entity.VaccinationStatus;
import jakarta.validation.constraints.*;

public record PetRequest(
        @NotBlank(message = "Name is required.")
        @Size(max = 100, message = "Name must be at most 100 characters.")
        String name,

        @NotNull(message = "Species is required.")
        Species species,

        @NotBlank(message = "Breed is required.")
        @Size(max = 100, message = "Breed must be at most 100 characters.")
        String breed,

        @NotNull(message = "Age is required.")
        @Min(value = 0, message = "Age cannot be negative.")
        @Max(value = 360, message = "Age must be 360 months or less.")
        Integer ageMonths,

        @NotNull(message = "Sex is required.")
        PetSex sex,

        @NotNull(message = "Size is required.")
        PetSize size,

        @Size(max = 1000, message = "Description must be at most 1,000 characters.")
        String description,

        @NotNull(message = "Vaccination status is required.")
        VaccinationStatus vaccinationStatus
) {}