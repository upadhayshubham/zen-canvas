package com.zencanvas.api.domain.repository;

import com.zencanvas.api.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySlug(String slug);

    Page<Product> findByPublishedTrue(Pageable pageable);

    Page<Product> findByPublishedTrueAndCategoryId(UUID categoryId, Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.published = true
        AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
          OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))
    """)
    Page<Product> searchPublished(@Param("query") String query, Pageable pageable);
}
