package com.zencanvas.api.domain.service;

import com.zencanvas.api.domain.dto.ForgotPasswordRequest;
import com.zencanvas.api.domain.dto.ResetPasswordRequest;
import com.zencanvas.api.domain.entity.PasswordResetToken;
import com.zencanvas.api.domain.repository.PasswordResetTokenRepository;
import com.zencanvas.api.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int TOKEN_EXPIRY_HOURS = 1;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void requestReset(ForgotPasswordRequest request) {
        // Always return without error — don't leak whether email exists
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            // Delete any existing token for this user before creating a new one
            tokenRepository.deleteByUser(user);

            var token = PasswordResetToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plus(TOKEN_EXPIRY_HOURS, ChronoUnit.HOURS))
                .used(false)
                .build();

            tokenRepository.save(token);

            // TODO: replace with real email sending (SendGrid / JavaMailSender)
            log.info("=== PASSWORD RESET TOKEN for {} === token={} (expires in {} hour(s))",
                user.getEmail(), token.getToken(), TOKEN_EXPIRY_HOURS);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        var tokenEntity = tokenRepository.findByToken(request.token())
            .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        if (tokenEntity.isUsed()) {
            throw new IllegalArgumentException("Reset token has already been used");
        }

        if (Instant.now().isAfter(tokenEntity.getExpiresAt())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        var user = tokenEntity.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));

        tokenEntity.setUsed(true);
        tokenRepository.save(tokenEntity);

        log.info("Password reset successfully for user={}", user.getEmail());
    }
}
