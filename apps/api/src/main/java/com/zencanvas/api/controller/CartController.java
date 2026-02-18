package com.zencanvas.api.controller;

import com.zencanvas.api.domain.dto.AddToCartRequest;
import com.zencanvas.api.domain.dto.CartResponse;
import com.zencanvas.api.domain.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
        @RequestHeader("X-Session-Id") String sessionId
    ) {
        return ResponseEntity.ok(cartService.getCart(sessionId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
        @RequestHeader("X-Session-Id") String sessionId,
        @Valid @RequestBody AddToCartRequest request
    ) {
        return ResponseEntity.ok(cartService.addItem(sessionId, request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateQuantity(
        @RequestHeader("X-Session-Id") String sessionId,
        @PathVariable UUID itemId,
        @RequestParam int quantity
    ) {
        return ResponseEntity.ok(cartService.updateQuantity(sessionId, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(
        @RequestHeader("X-Session-Id") String sessionId,
        @PathVariable UUID itemId
    ) {
        return ResponseEntity.ok(cartService.removeItem(sessionId, itemId));
    }
}
