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
    private boolean success;
    private String tryOnId;
    private String garmentId;
    private String garmentTitle;
    private String resultImage;
    private String resultImageUrl;
    private String status;
    private Instant createdAt;
}
