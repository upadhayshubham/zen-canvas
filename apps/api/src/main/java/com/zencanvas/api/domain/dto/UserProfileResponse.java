package com.zencanvas.api.domain.dto;

import com.zencanvas.api.domain.entity.User;

import java.util.UUID;

public record UserProfileResponse(
    UUID id,
    String email,
    String firstName,
    String lastName,
    String role
) {
    public static UserProfileResponse from(User u) {
        return new UserProfileResponse(u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getRole().name());
    }
}
