package com.zencanvas.api.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.zencanvas.api.config.StripeConfig;
import com.zencanvas.api.domain.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final StripeConfig stripeConfig;
    private final OrderService orderService;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
        @RequestBody String payload,
        @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeConfig.getWebhookSecret());
        } catch (SignatureVerificationException e) {
            log.warn("Invalid Stripe webhook signature: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            var dataObjectDeserializer = event.getDataObjectDeserializer();
            if (dataObjectDeserializer.getObject().isPresent()) {
                PaymentIntent paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
                String sessionId = paymentIntent.getMetadata().get("session_id");
                try {
                    orderService.handlePaymentSuccess(paymentIntent.getId(), sessionId);
                    log.info("Order confirmed for payment intent: {}", paymentIntent.getId());
                } catch (Exception e) {
                    log.error("Failed to process payment success: {}", e.getMessage(), e);
                    return ResponseEntity.internalServerError().body("Processing failed");
                }
            }
        }

        return ResponseEntity.ok("Received");
    }
}
