package com.zencanvas.api.domain.dto;

import java.math.BigDecimal;

public record PaymentIntentResponse(
    String clientSecret,
    String paymentIntentId,
    BigDecimal amount
) {}
