package com.drapeai.model.dto;

import lombok.Data;

@Data
public class TryOnRequest {
    private String productId;
    private String userImage; // Base64 encoded or image data string
    private String category;  // "footwear" or "apparel"
}
