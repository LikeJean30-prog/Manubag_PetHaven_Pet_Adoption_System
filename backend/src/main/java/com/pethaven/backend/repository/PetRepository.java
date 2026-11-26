package com.pethaven.backend.repository;

import com.pethaven.backend.entity.Pet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {

    List<Pet> findByShelter_ShelterIdOrderByCreatedAtDesc(Long shelterId);
}