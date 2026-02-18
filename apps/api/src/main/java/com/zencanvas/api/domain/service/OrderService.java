package com.zencanvas.api.domain.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.zencanvas.api.config.StripeConfig;
import com.zencanvas.api.domain.dto.CheckoutRequest;
import com.zencanvas.api.domain.dto.OrderResponse;
import com.zencanvas.api.domain.dto.PaymentIntentResponse;
import com.zencanvas.api.domain.entity.Order;
import com.zencanvas.api.domain.entity.OrderItem;
import com.zencanvas.api.domain.repository.CartItemRepository;
import com.zencanvas.api.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final StripeConfig stripeConfig;

    @Transactional
    public PaymentIntentResponse createPaymentIntent(String sessionId, CheckoutRequest request) {
        var cartItems = cartItemRepository.findBySessionId(sessionId);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        BigDecimal total = cartItems.stream()
            .map(i -> i.getVariant().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create pending order
        var order = Order.builder()
            .totalAmount(total)
            .status(Order.OrderStatus.PENDING)
            .shippingName(request.shippingName())
            .shippingEmail(request.shippingEmail())
            .shippingAddress(request.shippingAddress())
            .shippingCity(request.shippingCity())
            .shippingCountry(request.shippingCountry())
            .shippingPostcode(request.shippingPostcode())
            .build();

        cartItems.forEach(cartItem -> {
            var orderItem = OrderItem.builder()
                .order(order)
                .variant(cartItem.getVariant())
                .quantity(cartItem.getQuantity())
                .unitPrice(cartItem.getVariant().getPrice())
                .build();
            order.getItems().add(orderItem);
        });

        var savedOrder = orderRepository.save(order);

        // Create Stripe PaymentIntent
        try {
            long amountInCents = total.multiply(BigDecimal.valueOf(100)).longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .putMetadata("order_id", savedOrder.getId().toString())
                .putMetadata("session_id", sessionId)
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Store paymentIntentId on order
            savedOrder.setPaymentIntentId(paymentIntent.getId());
            orderRepository.save(savedOrder);

            return new PaymentIntentResponse(
                paymentIntent.getClientSecret(),
                paymentIntent.getId(),
                total
            );

        } catch (StripeException e) {
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void handlePaymentSuccess(String paymentIntentId, String sessionId) {
        // Idempotency guard
        var order = orderRepository.findByPaymentIntentId(paymentIntentId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found for payment intent: " + paymentIntentId));

        if (order.getStatus() == Order.OrderStatus.PENDING) {
            order.setStatus(Order.OrderStatus.PROCESSING);
            orderRepository.save(order);
            // Clear the cart after successful payment
            if (sessionId != null) {
                cartService.clearCart(sessionId);
            }
        }
        // If already PROCESSING or beyond — idempotent, do nothing
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUser(UUID userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
            .map(OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(UUID orderId) {
        return orderRepository.findById(orderId)
            .map(OrderResponse::from)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    }
}
