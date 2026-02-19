package com.zencanvas.api.domain.service;

import com.zencanvas.api.domain.dto.AuthResponse;
import com.zencanvas.api.domain.dto.LoginRequest;
import com.zencanvas.api.domain.dto.RegisterRequest;
import com.zencanvas.api.domain.entity.User;
import com.zencanvas.api.domain.repository.UserRepository;
import com.zencanvas.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.apache.commons.lang3.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CartService cartService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered: " + request.email());
        }

        var user = User.builder()
            .email(request.email())
            .passwordHash(passwordEncoder.encode(request.password()))
            .firstName(request.firstName())
            .lastName(request.lastName())
            .role(User.Role.CUSTOMER)
            .build();

        var saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getEmail(), saved.getRole().name());
        return toResponse(saved, token);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String sessionId) {
        var user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (StringUtils.isNotBlank(sessionId)) {
            cartService.mergeSessionCart(sessionId, user);
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return toResponse(user, token);
    }

    private AuthResponse toResponse(User user, String token) {
        return new AuthResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole().name()
        );
    }
}
