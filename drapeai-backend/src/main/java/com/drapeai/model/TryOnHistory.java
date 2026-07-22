package com.drapeai.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "try_on_history")
public class TryOnHistory {

    @Id
    private String id;

    private String userId;
    private String userEmail;
    private String productId;
    private String productName;
    private String category;
    private String userImageUrl;
    private String resultImageUrl;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
