package com.drapeai.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TryOnRequest {
    private String userPhotoBase64;
    private String userImage;
    private String garmentId;
    private String productId;
    private String category;
}
