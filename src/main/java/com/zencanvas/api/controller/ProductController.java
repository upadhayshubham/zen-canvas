package com.zencanvas.api.controller;

import com.zencanvas.api.domain.dto.CategoryResponse;
import com.zencanvas.api.domain.dto.ProductResponse;
import com.zencanvas.api.domain.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> list(
        @RequestParam(required = false) UUID categoryId,
        @RequestParam(required = false) String search,
        @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(productService.search(search, pageable));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(productService.listByCategory(categoryId, pageable));
        }
        return ResponseEntity.ok(productService.listPublished(pageable));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductResponse> getBySlug(@PathVariable String slug) {
        return productService.getBySlug(slug)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> categories() {
        return ResponseEntity.ok(productService.listCategories());
    }
}
