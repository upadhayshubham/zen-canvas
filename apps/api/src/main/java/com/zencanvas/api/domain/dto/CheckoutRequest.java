package com.zencanvas.api.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
    @NotBlank String shippingName,
    @Email @NotBlank String shippingEmail,
    @NotBlank String shippingAddress,
    @NotBlank String shippingCity,
    @NotBlank String shippingCountry,
    @NotBlank String shippingPostcode
) {}
