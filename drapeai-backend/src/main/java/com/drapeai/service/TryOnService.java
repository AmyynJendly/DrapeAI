package com.drapeai.service;

import com.drapeai.model.Product;
import com.drapeai.model.TryOnHistory;
import com.drapeai.model.dto.TryOnRequest;
import com.drapeai.model.dto.TryOnResponse;
import com.drapeai.repository.ProductRepository;
import com.drapeai.repository.TryOnHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TryOnService {

    private final ProductRepository productRepository;
    private final TryOnHistoryRepository tryOnHistoryRepository;

    public TryOnResponse processTryOn(String userEmail, TryOnRequest request) {
        log.info("Processing AI Try-On request for product: {} by user: {}", request.getProductId(), userEmail);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        // AI Processing pipeline simulation: returns styled result image URL
        String resultImageUrl = generateResultImage(product, request.getCategory());

        TryOnHistory history = TryOnHistory.builder()
                .userEmail(userEmail != null ? userEmail : "anonymous@drapeai.com")
                .productId(product.getId())
                .productName(product.getName())
                .category(product.getCategory())
                .userImageUrl(request.getUserImage())
                .resultImageUrl(resultImageUrl)
                .createdAt(Instant.now())
                .build();

        TryOnHistory saved = tryOnHistoryRepository.save(history);

        return TryOnResponse.builder()
                .id(saved.getId())
                .productId(product.getId())
                .productName(product.getName())
                .category(product.getCategory())
                .userImageUrl(request.getUserImage())
                .resultImageUrl(resultImageUrl)
                .status("COMPLETED")
                .message("AI Virtual Try-On generated successfully")
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public List<TryOnResponse> getUserHistory(String userEmail) {
        return tryOnHistoryRepository.findByUserEmailOrderByCreatedAtDesc(userEmail).stream()
                .map(history -> TryOnResponse.builder()
                        .id(history.getId())
                        .productId(history.getProductId())
                        .productName(history.getProductName())
                        .category(history.getCategory())
                        .userImageUrl(history.getUserImageUrl())
                        .resultImageUrl(history.getResultImageUrl())
                        .status("COMPLETED")
                        .createdAt(history.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private String generateResultImage(Product product, String category) {
        // High quality curated try-on showcase render results
        if ("footwear".equalsIgnoreCase(category) || "footwear".equalsIgnoreCase(product.getCategory())) {
            return "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80";
        }
        return "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80";
    }
}
