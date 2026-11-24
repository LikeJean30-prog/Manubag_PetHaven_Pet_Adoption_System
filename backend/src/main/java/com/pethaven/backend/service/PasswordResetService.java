package com.pethaven.backend.service;

import com.pethaven.backend.dto.ForgotPasswordRequest;
import com.pethaven.backend.dto.ResetPasswordRequest;
import com.pethaven.backend.entity.AccountStatus;
import com.pethaven.backend.entity.PasswordResetToken;
import com.pethaven.backend.entity.User;
import com.pethaven.backend.exception.BusinessRuleException;
import com.pethaven.backend.repository.PasswordResetTokenRepository;
import com.pethaven.backend.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final String frontendUrl;
    private final long expirationMinutes;
    private final String mailFrom;
    private final SecureRandom random = new SecureRandom();

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordEncoder passwordEncoder,
                                JavaMailSender mailSender,
                                @Value("${app.frontend.url}") String frontendUrl,
                                @Value("${app.reset.expiration-minutes:30}") long expirationMinutes,
                                @Value("${spring.mail.username}") String mailFrom) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl;
        this.expirationMinutes = expirationMinutes;
        this.mailFrom = mailFrom;
    }

    @Transactional
    public void requestReset(ForgotPasswordRequest req) {
        String email = req.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getAccountStatus() != AccountStatus.ACTIVE) {
            return;
        }

        Instant now = Instant.now();
        tokenRepository.findByUser_UserIdAndUsedAtIsNull(user.getUserId())
                .forEach(old -> old.setUsedAt(now));

        String rawToken = newRawToken();
        tokenRepository.save(new PasswordResetToken(
                user, sha256(rawToken), now.plus(expirationMinutes, ChronoUnit.MINUTES)));

        sendResetEmail(user, rawToken);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        PasswordResetToken token = tokenRepository.findByTokenHash(sha256(req.token().trim()))
                .orElseThrow(this::invalidLink);

        if (token.getUsedAt() != null || token.getExpiresAt().isBefore(Instant.now())) {
            throw invalidLink();
        }
        if (!req.newPassword().equals(req.confirmNewPassword())) {
            throw new BusinessRuleException("confirmNewPassword", "New passwords do not match.");
        }

        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        user.setFailedLoginCount(0);
        user.setLockedUntil(null);
        token.setUsedAt(Instant.now());
    }

    private void sendResetEmail(User user, String rawToken) {
        String link = frontendUrl + "/reset-password?token=" + rawToken;

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailFrom);
        msg.setTo(user.getEmail());
        msg.setSubject("Reset your PetHaven password");
        msg.setText("Hi " + user.getFirstName() + ",\n\n"
                + "We received a request to reset your PetHaven password.\n\n"
                + "Open this link to choose a new password:\n" + link + "\n\n"
                + "This link expires in " + expirationMinutes + " minutes and can be used only once.\n"
                + "If you did not request this, you can ignore this email. Your password will not change.\n\n"
                + "PetHaven - Adopt. Care. Connect.");

        try {
            mailSender.send(msg);
        } catch (MailException e) {
            log.error("Could not send password reset email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    private BusinessRuleException invalidLink() {
        return new BusinessRuleException("token",
                "This reset link is invalid or has expired. Please request a new one.");
    }

    private String newRawToken() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}