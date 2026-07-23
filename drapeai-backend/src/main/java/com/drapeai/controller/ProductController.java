package com.drapeai.controller;

import com.drapeai.model.Product;
import com.drapeai.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam(required = false) String category) {
        if (category != null && !category.trim().isEmpty()) {
            return ResponseEntity.ok(productRepository.findByCategory(category));
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        return productRepository.findById(id)
                .map(existing -> {
                    if (product.getBrand() != null) {
                        existing.setBrand(product.getBrand());
                    }
                    if (product.getName() != null) {
                        existing.setName(product.getName());
                    }
                    if (product.getSlug() != null) {
                        existing.setSlug(product.getSlug());
                    }
                    if (product.getDescription() != null) {
                        existing.setDescription(product.getDescription());
                    }
                    if (product.getCategory() != null) {
                        existing.setCategory(product.getCategory());
                    }
                    if (product.getPrice() != null) {
                        existing.setPrice(product.getPrice());
                    }
                    if (product.getImageUrl() != null) {
                        existing.setImageUrl(product.getImageUrl());
                    }
                    if (product.getFit() != null) {
                        existing.setFit(product.getFit());
                    }
                    if (product.getMaterials() != null) {
                        existing.setMaterials(product.getMaterials());
                    }
                    if (product.getCareInstructions() != null) {
                        existing.setCareInstructions(product.getCareInstructions());
                    }
                    if (product.getHighlights() != null) {
                        existing.setHighlights(product.getHighlights());
                    }
                    return ResponseEntity.ok(productRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
