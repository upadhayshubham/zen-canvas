package com.zencanvas.api.domain.service;

import com.zencanvas.api.domain.dto.CategoryResponse;
import com.zencanvas.api.domain.dto.ProductResponse;
import com.zencanvas.api.domain.repository.CategoryRepository;
import com.zencanvas.api.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> listPublished(Pageable pageable) {
        return productRepository.findByPublishedTrue(pageable).map(ProductResponse::from);
    }

    public Page<ProductResponse> listByCategory(UUID categoryId, Pageable pageable) {
        return productRepository.findByPublishedTrueAndCategoryId(categoryId, pageable).map(ProductResponse::from);
    }

    public Page<ProductResponse> search(String query, Pageable pageable) {
        return productRepository.searchPublished(query, pageable).map(ProductResponse::from);
    }

    public Optional<ProductResponse> getBySlug(String slug) {
        return productRepository.findBySlug(slug).map(ProductResponse::from);
    }

    public List<CategoryResponse> listCategories() {
        return categoryRepository.findAll().stream().map(CategoryResponse::from).toList();
    }
}
