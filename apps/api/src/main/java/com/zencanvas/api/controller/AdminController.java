package com.zencanvas.api.controller;

import com.zencanvas.api.domain.dto.OrderResponse;
import com.zencanvas.api.domain.entity.Order.OrderStatus;
import com.zencanvas.api.domain.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminOrderService adminOrderService;

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderResponse>> listOrders(
        @RequestParam(required = false) OrderStatus status,
        @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(adminOrderService.listOrders(status, pageable));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(adminOrderService.getOrder(orderId));
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateStatus(
        @PathVariable UUID orderId,
        @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(adminOrderService.updateOrderStatus(orderId, status));
    }
}
