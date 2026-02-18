package com.zencanvas.api.domain.dto;

import com.zencanvas.api.domain.entity.Product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ProductResponse(
    UUID id,
    String name,
    String slug,
    String description,
    UUID categoryId,
    String categoryName,
    boolean published,
    List<ImageDto> images,
    List<VariantDto> variants,
    Instant createdAt
) {
    public record ImageDto(UUID id, String cloudinaryId, String secureUrl, int displayOrder) {}
    public record VariantDto(UUID id, String sku, BigDecimal price, int stock, Map<String, String> attributes) {}

    public static ProductResponse from(Product p) {
        return new ProductResponse(
            p.getId(),
            p.getName(),
            p.getSlug(),
            p.getDescription(),
            p.getCategory() != null ? p.getCategory().getId() : null,
            p.getCategory() != null ? p.getCategory().getName() : null,
            p.isPublished(),
            p.getImages().stream().map(i -> new ImageDto(i.getId(), i.getCloudinaryId(), i.getSecureUrl(), i.getDisplayOrder())).toList(),
            p.getVariants().stream().map(v -> new VariantDto(v.getId(), v.getSku(), v.getPrice(), v.getStock(), v.getAttributes())).toList(),
            p.getCreatedAt()
        );
    }
}
