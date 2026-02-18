package com.zencanvas.api.domain.repository;

import com.zencanvas.api.domain.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    Page<Order> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Optional<Order> findByPaymentIntentId(String paymentIntentId);

    boolean existsByPaymentIntentId(String paymentIntentId);
}
