package com.zencanvas.api.domain.dto;

import com.zencanvas.api.domain.entity.CartItem;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

public record CartItemResponse(
    UUID id,
    UUID variantId,
    String sku,
    String productName,
    String productSlug,
    BigDecimal price,
    int quantity,
    BigDecimal subtotal,
    String imageUrl,
    Map<String, String> attributes
) {
    public static CartItemResponse from(CartItem item) {
        var variant = item.getVariant();
        var product = variant.getProduct();
        String imageUrl = product.getImages().isEmpty() ? null
            : product.getImages().get(0).getSecureUrl();

        return new CartItemResponse(
            item.getId(),
            variant.getId(),
            variant.getSku(),
            product.getName(),
            product.getSlug(),
            variant.getPrice(),
            item.getQuantity(),
            variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())),
            imageUrl,
            variant.getAttributes()
        );
    }
}
