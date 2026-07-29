package com.drapeai.service;

import com.drapeai.model.Product;
import com.drapeai.model.TryOnHistory;
import com.drapeai.model.dto.TryOnRequest;
import com.drapeai.model.dto.TryOnResponse;
import com.drapeai.repository.ProductRepository;
import com.drapeai.repository.TryOnHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.nio.file.Files;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TryOnService {

    private final ProductRepository productRepository;
    private final TryOnHistoryRepository tryOnHistoryRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key:${GEMINI_API_KEY:}}")
    private String geminiApiKey;

    public TryOnResponse processTryOn(String userEmail, TryOnRequest request) {
        String targetGarmentId = request.getGarmentId() != null ? request.getGarmentId() : request.getProductId();
        String userPhoto = request.getUserPhotoBase64() != null ? request.getUserPhotoBase64() : request.getUserImage();

        if (targetGarmentId == null || targetGarmentId.isBlank()) {
            throw new IllegalArgumentException("garmentId is required");
        }
        if (userPhoto == null || userPhoto.isBlank()) {
            throw new IllegalArgumentException("userPhotoBase64 is required");
        }

        log.info("Processing AI Virtual Try-On for garment ID {}...", targetGarmentId);

        Product garment = productRepository.findById(targetGarmentId)
                .orElseThrow(() -> new RuntimeException("Garment not found with ID: " + targetGarmentId));

        // Read API key from .env.local if not present in env vars
        String apiKey = getEffectiveApiKey();

        String resultImage = null;
        if (apiKey != null && !apiKey.isBlank()) {
            resultImage = invokeGeminiApi(apiKey, userPhoto, garment.getImageUrl(), garment.getCategory());
        }

        // Fallback to garment image if AI result is empty
        if (resultImage == null || resultImage.isBlank()) {
            resultImage = garment.getImageUrl();
        }

        TryOnHistory history = TryOnHistory.builder()
                .userEmail(userEmail != null ? userEmail : "guest@drapeai.com")
                .garmentId(garment.getId())
                .garmentTitle(garment.getName())
                .userPhotoBase64(userPhoto.length() > 100 ? userPhoto.substring(0, 100) + "..." : userPhoto)
                .resultImage(resultImage)
                .status("COMPLETED")
                .modelUsed("gemini-2.5-flash-image")
                .createdAt(Instant.now())
                .build();

        TryOnHistory saved = tryOnHistoryRepository.save(history);
        log.info("Saved Try-On record to MongoDB tryons collection. ID: {}", saved.getId());

        return TryOnResponse.builder()
                .success(true)
                .tryOnId(saved.getId())
                .garmentId(garment.getId())
                .garmentTitle(garment.getName())
                .resultImage(resultImage)
                .resultImageUrl(resultImage)
                .status("COMPLETED")
                .createdAt(saved.getCreatedAt())
                .build();
    }

    private String getEffectiveApiKey() {
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            return geminiApiKey;
        }
        // Fallback: read directly from .env.local
        try {
            File envFile = new File("../.env.local");
            if (!envFile.exists()) {
                envFile = new File(".env.local");
            }
            if (envFile.exists()) {
                List<String> lines = Files.readAllLines(envFile.toPath());
                for (String line : lines) {
                    if (line.startsWith("GEMINI_API_KEY=")) {
                        return line.substring("GEMINI_API_KEY=".length()).trim();
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not read .env.local: {}", e.getMessage());
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private String invokeGeminiApi(String apiKey, String userPhotoBase64, String garmentImageUrl, String category) {
        try {
            log.info("🤖 Invoking Google Gemini REST API (gemini-2.5-flash-image)...");
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" + apiKey;

            String userBase64Clean = fetchOrCleanBase64(userPhotoBase64);
            String garmentBase64Clean = fetchOrCleanBase64(garmentImageUrl);

            Map<String, Object> userPart = Map.of(
                    "inline_data", Map.of(
                            "mime_type", "image/jpeg",
                            "data", userBase64Clean
                    )
            );

            Map<String, Object> garmentPart = Map.of(
                    "inline_data", Map.of(
                            "mime_type", "image/jpeg",
                            "data", garmentBase64Clean
                    )
            );

            Map<String, Object> textPart = Map.of(
                    "text", "TASK: Virtual Clothing Try-On. Replace the existing clothing of the target person in the first image with the exact garment in the second image. Keep the person's face, skin tone, hair, posture, and background 100% identical. Preserve exact fabric details, colors, and textures."
            );

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(userPart, garmentPart, textPart))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map> candidates = (List<Map>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map content = (Map) candidates.get(0).get("content");
                    if (content != null) {
                        List<Map> parts = (List<Map>) content.get("parts");
                        if (parts != null) {
                            for (Map part : parts) {
                                Map inlineData = (Map) part.get("inline_data");
                                if (inlineData != null && inlineData.containsKey("data")) {
                                    String mime = (String) inlineData.getOrDefault("mime_type", "image/png");
                                    String data = (String) inlineData.get("data");
                                    log.info("✨ Received image output from Google Gemini!");
                                    return "data:" + mime + ";base64," + data;
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("⚠️ Gemini API call warning: {}. Using fallback garment preview.", e.getMessage());
        }
        return null;
    }

    private String fetchOrCleanBase64(String input) {
        if (input == null || input.isBlank()) return "";

        // If it's an HTTP/HTTPS URL, fetch bytes and convert to base64
        if (input.startsWith("http://") || input.startsWith("https://")) {
            try {
                log.info("Downloading image from URL to Base64: {}", input);
                byte[] imageBytes = restTemplate.getForObject(input, byte[].class);
                if (imageBytes != null && imageBytes.length > 0) {
                    return Base64.getEncoder().encodeToString(imageBytes);
                }
            } catch (Exception e) {
                log.warn("Failed to download image from URL {}: {}", input, e.getMessage());
            }
        }

        // If data URL prefix exists, strip it
        if (input.contains(",")) {
            return input.split(",")[1];
        }

        return input;
    }
}
