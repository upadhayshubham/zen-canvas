package com.zencanvas.api.domain.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
    List<CartItemResponse> items,
    int totalItems,
    BigDecimal totalPrice
) {
    public static CartResponse from(List<CartItemResponse> items) {
        int totalItems = items.stream().mapToInt(CartItemResponse::quantity).sum();
        BigDecimal totalPrice = items.stream()
            .map(CartItemResponse::subtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(items, totalItems, totalPrice);
    }
}
