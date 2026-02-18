package com.zencanvas.api.controller;

import com.zencanvas.api.domain.dto.CheckoutRequest;
import com.zencanvas.api.domain.dto.PaymentIntentResponse;
import com.zencanvas.api.domain.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final OrderService orderService;

    @PostMapping("/payment-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
        @RequestHeader("X-Session-Id") String sessionId,
        @Valid @RequestBody CheckoutRequest request
    ) {
        return ResponseEntity.ok(orderService.createPaymentIntent(sessionId, request));
    }
}
