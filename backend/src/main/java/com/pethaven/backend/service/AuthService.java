package com.pethaven.backend.service;

import com.pethaven.backend.dto.LoginRequest;
import com.pethaven.backend.dto.LoginResponse;
import com.pethaven.backend.dto.RegisterAdopterRequest;
import com.pethaven.backend.dto.RegisterShelterRequest;
import com.pethaven.backend.entity.AccountStatus;
import com.pethaven.backend.entity.Role;
import com.pethaven.backend.entity.Shelter;
import com.pethaven.backend.entity.User;
import com.pethaven.backend.entity.VerificationStatus;
import com.pethaven.backend.exception.AccountUnavailableException;
import com.pethaven.backend.exception.EmailAlreadyUsedException;
import com.pethaven.backend.exception.InvalidCredentialsException;
import com.pethaven.backend.repository.ShelterRepository;
import com.pethaven.backend.repository.UserRepository;
import com.pethaven.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 15;

    private final UserRepository userRepository;
    private final ShelterRepository shelterRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, ShelterRepository shelterRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.shelterRepository = shelterRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public User registerAdopter(RegisterAdopterRequest req) {
        String email = normalizeEmail(req.email());
        ensureEmailIsFree(email);

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setFirstName(req.firstName().trim());
        user.setLastName(req.lastName().trim());
        user.setPhoneNumber(req.phoneNumber().trim());
        user.setRole(Role.ADOPTER);
        return userRepository.save(user);
    }

    @Transactional          // both rows are saved together, or neither is
    public Shelter registerShelter(RegisterShelterRequest req) {
        String email = normalizeEmail(req.email());
        ensureEmailIsFree(email);

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setFirstName(req.contactFirstName().trim());
        user.setLastName(req.contactLastName().trim());
        user.setPhoneNumber(req.phoneNumber().trim());
        user.setRole(Role.SHELTER);
        userRepository.save(user);

        Shelter shelter = new Shelter();
        shelter.setUser(user);
        shelter.setOrganizationName(req.organizationName().trim());
        shelter.setOrganizationType(req.organizationType());
        shelter.setDescription(req.description() == null ? null : req.description().trim());
        shelter.setAddress(req.address().trim());
        shelter.setContactNumber(req.phoneNumber().trim());
        shelter.setVerificationStatus(VerificationStatus.PENDING);     // FR-002
        // Part B: geocode the address here and set latitude/longitude (FR-040)
        return shelterRepository.save(shelter);
    }

    @Transactional(noRollbackFor = InvalidCredentialsException.class)
    public LoginResponse login(LoginRequest req) {
        String email = normalizeEmail(req.email());
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new AccountUnavailableException(
                    "Your account is suspended. Please contact the administrator.");
        }
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now())) {
            throw new AccountUnavailableException(
                    "Too many failed login attempts. Please try again in 15 minutes.");
        }

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            int failures = user.getFailedLoginCount() + 1;
            if (failures >= MAX_FAILED_ATTEMPTS) {
                user.setLockedUntil(Instant.now().plus(LOCK_MINUTES, ChronoUnit.MINUTES));
                failures = 0;
            }
            user.setFailedLoginCount(failures);
            throw new InvalidCredentialsException();
        }

        user.setFailedLoginCount(0);
        user.setLockedUntil(null);

        return new LoginResponse(jwtService.generateToken(user), "Bearer",
                jwtService.getExpirationSeconds(), user.getUserId(), user.getRole().name());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private void ensureEmailIsFree(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyUsedException();
        }
    }
}