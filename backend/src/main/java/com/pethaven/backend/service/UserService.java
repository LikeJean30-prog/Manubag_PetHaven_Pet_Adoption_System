package com.pethaven.backend.service;

import com.pethaven.backend.dto.ChangePasswordRequest;
import com.pethaven.backend.dto.UpdateProfileRequest;
import com.pethaven.backend.entity.User;
import com.pethaven.backend.exception.BusinessRuleException;
import com.pethaven.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found."));
    }

    @Transactional
    public User updateProfile(Long userId, UpdateProfileRequest req) {          // FR-007
        User user = getById(userId);                  // only the logged-in user's own account
        user.setFirstName(req.firstName().trim());
        user.setLastName(req.lastName().trim());
        user.setPhoneNumber(req.phoneNumber().trim());
        return user;                                   // saved automatically when the transaction ends
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest req) {        // FR-007
        User user = getById(userId);

        if (!passwordEncoder.matches(req.currentPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("currentPassword", "Current password is incorrect.");
        }
        if (!req.newPassword().equals(req.confirmNewPassword())) {
            throw new BusinessRuleException("confirmNewPassword", "New passwords do not match.");
        }
        if (passwordEncoder.matches(req.newPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("newPassword", "New password must be different from your current password.");
        }

        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));   // BCrypt (NFR-007);
    }
}