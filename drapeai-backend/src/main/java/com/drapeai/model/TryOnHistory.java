package com.drapeai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tryons")
public class TryOnHistory {
    @Id
    private String id;
    private String userEmail;
    private String garmentId;
    private String garmentTitle;
    private String userPhotoBase64;
    private String resultImage;
    private String status;
    private String modelUsed;
    private Instant createdAt;
}
