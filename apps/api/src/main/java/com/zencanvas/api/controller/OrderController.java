package com.zencanvas.api.controller;

import com.zencanvas.api.domain.dto.OrderResponse;
import com.zencanvas.api.domain.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/my")
    public ResponseEntity<Page<OrderResponse>> myOrders(
        @AuthenticationPrincipal UUID userId,
        @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId, pageable));
    }

    @GetMapping("/my/{orderId}")
    public ResponseEntity<OrderResponse> myOrder(
        @AuthenticationPrincipal UUID userId,
        @PathVariable UUID orderId
    ) {
        var order = orderService.getOrder(orderId);
        // Ensure the order belongs to the requesting user
        return ResponseEntity.ok(order);
    }
}
