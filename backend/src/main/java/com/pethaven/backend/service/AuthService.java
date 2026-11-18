package com.pethaven.backend.service;

import com.pethaven.backend.dto.RegisterAdopterRequest;
import com.pethaven.backend.entity.Role;
import com.pethaven.backend.entity.User;
import com.pethaven.backend.exception.EmailAlreadyUsedException;
import com.pethaven.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerAdopter(RegisterAdopterRequest req) {
        String email = req.email().trim().toLowerCase();     // Juan@X.com and juan@x.com count as the same

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyUsedException();             // FR-001: email must be unique
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.password()));   // BCrypt, NFR-007
        user.setFirstName(req.firstName().trim());
        user.setLastName(req.lastName().trim());
        user.setPhoneNumber(req.phoneNumber().trim());
        user.setRole(Role.ADOPTER);

        return userRepository.save(user);
    }
}