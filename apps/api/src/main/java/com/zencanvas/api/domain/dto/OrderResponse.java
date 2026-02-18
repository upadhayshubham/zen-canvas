package com.zencanvas.api.domain.dto;

import com.zencanvas.api.domain.entity.Order;
import com.zencanvas.api.domain.entity.Order.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
    UUID id,
    OrderStatus status,
    BigDecimal totalAmount,
    String shippingName,
    String shippingEmail,
    String shippingAddress,
    String shippingCity,
    String shippingCountry,
    String shippingPostcode,
    List<OrderItemDto> items,
    Instant createdAt
) {
    public record OrderItemDto(
        UUID id,
        UUID variantId,
        String sku,
        String productName,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
    ) {}

    public static OrderResponse from(Order o) {
        return new OrderResponse(
            o.getId(),
            o.getStatus(),
            o.getTotalAmount(),
            o.getShippingName(),
            o.getShippingEmail(),
            o.getShippingAddress(),
            o.getShippingCity(),
            o.getShippingCountry(),
            o.getShippingPostcode(),
            o.getItems().stream().map(i -> new OrderItemDto(
                i.getId(),
                i.getVariant().getId(),
                i.getVariant().getSku(),
                i.getVariant().getProduct().getName(),
                i.getQuantity(),
                i.getUnitPrice(),
                i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()))
            )).toList(),
            o.getCreatedAt()
        );
    }
}
