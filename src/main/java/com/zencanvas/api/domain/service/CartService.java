package com.zencanvas.api.domain.service;

import com.zencanvas.api.domain.dto.AddToCartRequest;
import com.zencanvas.api.domain.dto.CartItemResponse;
import com.zencanvas.api.domain.dto.CartResponse;
import com.zencanvas.api.domain.entity.CartItem;
import com.zencanvas.api.domain.entity.User;
import com.zencanvas.api.domain.repository.CartItemRepository;
import com.zencanvas.api.domain.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository variantRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(String sessionId) {
        List<CartItemResponse> items = cartItemRepository.findBySessionId(sessionId)
            .stream().map(CartItemResponse::from).toList();
        return CartResponse.from(items);
    }

    @Transactional
    public CartResponse addItem(String sessionId, AddToCartRequest request) {
        var variant = variantRepository.findById(request.variantId())
            .orElseThrow(() -> new IllegalArgumentException("Variant not found: " + request.variantId()));

        var existing = cartItemRepository.findBySessionIdAndVariantId(sessionId, request.variantId());
        if (existing.isPresent()) {
            var item = existing.get();
            item.setQuantity(item.getQuantity() + request.quantity());
            cartItemRepository.save(item);
        } else {
            cartItemRepository.save(CartItem.builder()
                .sessionId(sessionId)
                .variant(variant)
                .quantity(request.quantity())
                .build());
        }
        return getCart(sessionId);
    }

    @Transactional
    public CartResponse updateQuantity(String sessionId, UUID cartItemId, int quantity) {
        var item = cartItemRepository.findById(cartItemId)
            .filter(i -> sessionId.equals(i.getSessionId()))
            .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return getCart(sessionId);
    }

    @Transactional
    public CartResponse removeItem(String sessionId, UUID cartItemId) {
        cartItemRepository.findById(cartItemId)
            .filter(i -> sessionId.equals(i.getSessionId()))
            .ifPresent(cartItemRepository::delete);
        return getCart(sessionId);
    }

    @Transactional
    public void clearCart(String sessionId) {
        cartItemRepository.deleteBySessionId(sessionId);
    }

    /**
     * Merges a guest session cart into the authenticated user's cart on login.
     * If both carts have the same variant, quantities are summed.
     * The session cart is cleared after merge.
     */
    @Transactional
    public void mergeSessionCart(String sessionId, User user) {
        if (StringUtils.isBlank(sessionId)) return;

        List<CartItem> sessionItems = cartItemRepository.findBySessionId(sessionId);
        if (sessionItems.isEmpty()) return;

        for (CartItem sessionItem : sessionItems) {
            cartItemRepository.findByUserIdAndVariantId(user.getId(), sessionItem.getVariant().getId())
                .ifPresentOrElse(
                    existing -> {
                        // Variant already in user's cart — add quantities
                        existing.setQuantity(existing.getQuantity() + sessionItem.getQuantity());
                        cartItemRepository.save(existing);
                    },
                    () -> {
                        // New variant — reassign session item to user
                        sessionItem.setSessionId(null);
                        sessionItem.setUser(user);
                        cartItemRepository.save(sessionItem);
                    }
                );
        }

        // Remove any remaining session items (the ones that were merged by quantity)
        cartItemRepository.deleteBySessionId(sessionId);
    }
}
