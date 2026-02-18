package com.zencanvas.api.domain.repository;

import com.zencanvas.api.domain.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    List<CartItem> findBySessionId(String sessionId);

    List<CartItem> findByUserId(UUID userId);

    Optional<CartItem> findBySessionIdAndVariantId(String sessionId, UUID variantId);

    Optional<CartItem> findByUserIdAndVariantId(UUID userId, UUID variantId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.sessionId = :sessionId")
    void deleteBySessionId(@Param("sessionId") String sessionId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);
}
