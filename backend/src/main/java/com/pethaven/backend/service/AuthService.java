package com.pethaven.backend.service;

import com.pethaven.backend.dto.LoginRequest;
import com.pethaven.backend.dto.LoginResponse;
import com.pethaven.backend.dto.RegisterAdopterRequest;
import com.pethaven.backend.entity.AccountStatus;
import com.pethaven.backend.entity.Role;
import com.pethaven.backend.entity.User;
import com.pethaven.backend.exception.AccountUnavailableException;
import com.pethaven.backend.exception.EmailAlreadyUsedException;
import com.pethaven.backend.exception.InvalidCredentialsException;
import com.pethaven.backend.repository.UserRepository;
import com.pethaven.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;     // FR-008
    private static final int LOCK_MINUTES = 15;           // FR-008

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public User registerAdopter(RegisterAdopterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyUsedException();
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setFirstName(req.firstName().trim());
        user.setLastName(req.lastName().trim());
        user.setPhoneNumber(req.phoneNumber().trim());
        user.setRole(Role.ADOPTER);
        return userRepository.save(user);
    }

    // noRollbackFor: keep the failed-attempt count even though we throw an error
    @Transactional(noRollbackFor = InvalidCredentialsException.class)
    public LoginResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {                        // FR-005
            throw new AccountUnavailableException(
                    "Your account is suspended. Please contact the administrator.");
        }
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now())) { // FR-008
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
            throw new InvalidCredentialsException();                                     // FR-003
        }

        user.setFailedLoginCount(0);                                                     // FR-008 reset
        user.setLockedUntil(null);

        return new LoginResponse(jwtService.generateToken(user), "Bearer",
                jwtService.getExpirationSeconds(), user.getUserId(), user.getRole().name());
    }
}