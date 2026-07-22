package com.drapeai.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TryOnResponse {
    private String id;
    private String productId;
    private String productName;
    private String category;
    private String userImageUrl;
    private String resultImageUrl;
    private String status;
    private String message;
    private Instant createdAt;
}
