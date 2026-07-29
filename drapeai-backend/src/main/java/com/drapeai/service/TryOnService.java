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

    @Value("${hf.api.token:}")
    private String hfApiToken;

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

        String hfToken = getEffectiveHfToken();

        if (hfToken == null || hfToken.isBlank()) {
            throw new IllegalStateException(
                "HuggingFace API token is missing. Please add HF_API_TOKEN=hf_xxx to your .env.local file and restart the backend.");
        }

        String garmentImageBase64 = fetchOrCleanBase64(garment.getImageUrl());
        String userImageBase64 = cleanBase64(userPhoto);

        String resultImage = invokeIdmVton(hfToken, userImageBase64, garmentImageBase64);

        if (resultImage == null || resultImage.isBlank()) {
            throw new IllegalStateException(
                "IDM-VTON AI model did not return a result. The HuggingFace Space may be overloaded or sleeping — please try again in 30 seconds.");
        }

        TryOnHistory history = TryOnHistory.builder()
                .userEmail(userEmail != null ? userEmail : "guest@drapeai.com")
                .garmentId(garment.getId())
                .garmentTitle(garment.getName())
                .userPhotoBase64(userPhoto.length() > 100 ? userPhoto.substring(0, 100) + "..." : userPhoto)
                .resultImage(resultImage)
                .status("COMPLETED")
                .modelUsed("IDM-VTON (HuggingFace)")
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

    /**
     * Calls the IDM-VTON HuggingFace Space via Gradio REST API (two-step: submit → poll result).
     */
    @SuppressWarnings("unchecked")
    private String invokeIdmVton(String hfToken, String userBase64, String garmentBase64) {
        try {
            log.info("🤖 Invoking IDM-VTON via HuggingFace Gradio API...");

            String submitUrl = "https://yisol-idm-vton.hf.space/call/tryon";

            // Gradio v4 payload: images passed as data URL strings
            // Input 0: ImageEditor dict { background: dataUrl, layers: [], composite: null }
            // Input 1: Garment image data URL string
            // Input 2: Garment description (string)
            // Input 3: Auto-mask (bool)
            // Input 4: Auto-crop & paste back (bool)
            // Input 5: Denoising steps (int)
            // Input 6: Seed (int)
            Map<String, Object> humanImgDict = new HashMap<>();
            humanImgDict.put("background", "data:image/jpeg;base64," + userBase64);
            humanImgDict.put("layers", List.of());
            humanImgDict.put("composite", null);

            List<Object> inputs = new ArrayList<>();
            inputs.add(humanImgDict);
            inputs.add("data:image/jpeg;base64," + garmentBase64);
            inputs.add("luxury fashion garment");
            inputs.add(true);
            inputs.add(true);
            inputs.add(30);
            inputs.add(42);

            Map<String, Object> submitBody = new HashMap<>();
            submitBody.put("data", inputs);
            submitBody.put("fn_index", 0);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (hfToken != null && !hfToken.isBlank()) {
                headers.setBearerAuth(hfToken);
            }

            // Step 1: Submit job and get event_id
            HttpEntity<Map<String, Object>> submitEntity = new HttpEntity<>(submitBody, headers);
            ResponseEntity<Map> submitResponse;
            try {
                submitResponse = restTemplate.postForEntity(submitUrl, submitEntity, Map.class);
            } catch (Exception submitEx) {
                log.warn("⚠️ IDM-VTON submit request failed: {} - {}", submitEx.getClass().getSimpleName(), submitEx.getMessage());
                return null;
            }

            if (submitResponse.getBody() == null || !submitResponse.getStatusCode().is2xxSuccessful()) {
                log.warn("IDM-VTON submit returned non-200 status: {}", submitResponse.getStatusCode());
                return null;
            }

            String eventId = (String) submitResponse.getBody().get("event_id");
            if (eventId == null) {
                log.warn("IDM-VTON: No event_id in submit response. Body: {}", submitResponse.getBody());
                return null;
            }

            log.info("IDM-VTON job submitted. Event ID: {}. Polling for result...", eventId);

            // Step 2: Poll for result (max 90 seconds, every 3 seconds)
            String resultUrl = "https://yisol-idm-vton.hf.space/call/tryon/" + eventId;
            HttpEntity<Void> pollEntity = new HttpEntity<>(headers);

            for (int attempt = 0; attempt < 30; attempt++) {
                Thread.sleep(3000);
                try {
                    ResponseEntity<String> pollResponse = restTemplate.exchange(
                        resultUrl, HttpMethod.GET, pollEntity, String.class);

                    String body = pollResponse.getBody();
                    if (body != null && body.contains("\"data\"")) {
                        // Parse SSE or JSON response - extract image URL or base64
                        String resultImageUrl = extractImageFromGradioResponse(body);
                        if (resultImageUrl != null) {
                            log.info("✨ IDM-VTON result received after {} poll attempts!", attempt + 1);
                            // If it's a relative gradio URL, prepend the base
                            if (resultImageUrl.startsWith("/")) {
                                resultImageUrl = "https://yisol-idm-vton.hf.space" + resultImageUrl;
                            }
                            // Convert to base64 data URL for frontend
                            byte[] imgBytes = restTemplate.getForObject(resultImageUrl, byte[].class);
                            if (imgBytes != null && imgBytes.length > 0) {
                                return "data:image/png;base64," + Base64.getEncoder().encodeToString(imgBytes);
                            }
                        }
                        if (body.contains("\"error\"")) {
                            log.warn("IDM-VTON error in response: {}", body.substring(0, Math.min(300, body.length())));
                            break;
                        }
                    }
                } catch (Exception pollEx) {
                    log.debug("IDM-VTON poll attempt {}: {} - {}", attempt + 1, pollEx.getClass().getSimpleName(), pollEx.getMessage());
                }
            }

            log.warn("IDM-VTON: Timed out waiting for result after 90 seconds.");
        } catch (Exception e) {
            log.warn("⚠️ IDM-VTON API error: {} - {}", e.getClass().getSimpleName(), e.getMessage(), e);
        }
        return null;
    }


    /**
     * Extracts the image URL or path from a Gradio SSE/JSON response body.
     */
    private String extractImageFromGradioResponse(String body) {
        try {
            // SSE data line looks like: data: [{"path": "/tmp/xxx.png", ...}, ...]
            // or data: [{"url": "https://...", ...}, ...]
            int dataIdx = body.lastIndexOf("data: [");
            if (dataIdx >= 0) {
                String jsonPart = body.substring(dataIdx + 6).trim();
                // Extract url field
                int urlIdx = jsonPart.indexOf("\"url\":\"");
                if (urlIdx >= 0) {
                    int start = urlIdx + 7;
                    int end = jsonPart.indexOf("\"", start);
                    if (end > start) return jsonPart.substring(start, end);
                }
                // Extract path field as fallback
                int pathIdx = jsonPart.indexOf("\"path\":\"");
                if (pathIdx >= 0) {
                    int start = pathIdx + 8;
                    int end = jsonPart.indexOf("\"", start);
                    if (end > start) return jsonPart.substring(start, end);
                }
            }
        } catch (Exception e) {
            log.debug("Could not parse Gradio response: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Reads the HuggingFace token from @Value injection or fallback .env.local file.
     */
    private String getEffectiveHfToken() {
        if (hfApiToken != null && !hfApiToken.isBlank()) {
            return hfApiToken;
        }
        try {
            File envFile = new File("../.env.local");
            if (!envFile.exists()) envFile = new File(".env.local");
            if (envFile.exists()) {
                List<String> lines = Files.readAllLines(envFile.toPath());
                for (String line : lines) {
                    if (line.startsWith("HF_API_TOKEN=")) {
                        return line.substring("HF_API_TOKEN=".length()).trim();
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not read .env.local for HF_API_TOKEN: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Strips data URL prefix from a base64 string if present.
     */
    private String cleanBase64(String input) {
        if (input == null || input.isBlank()) return "";
        if (input.contains(",")) return input.split(",")[1];
        return input;
    }

    /**
     * Resolves image paths/URLs to raw base64 strings.
     */
    private String fetchOrCleanBase64(String input) {
        if (input == null || input.isBlank()) return "";

        // Relative path like /products/product1.png — read from local public directory
        if (input.startsWith("/") || input.startsWith("products/")) {
            try {
                String relativePath = input.startsWith("/") ? input.substring(1) : input;
                File file = new File("../drapeai-frontend/public/" + relativePath);
                if (!file.exists()) file = new File("drapeai-frontend/public/" + relativePath);
                if (file.exists()) {
                    log.info("Loading local garment image from disk: {}", file.getAbsolutePath());
                    byte[] bytes = Files.readAllBytes(file.toPath());
                    return Base64.getEncoder().encodeToString(bytes);
                } else {
                    byte[] bytes = restTemplate.getForObject("http://localhost:5173/" + relativePath, byte[].class);
                    if (bytes != null && bytes.length > 0) return Base64.getEncoder().encodeToString(bytes);
                }
            } catch (Exception e) {
                log.warn("Failed to load local product image {}: {}", input, e.getMessage());
            }
        }

        // HTTP/HTTPS URL — download and convert to base64
        if (input.startsWith("http://") || input.startsWith("https://")) {
            try {
                log.info("Downloading image from URL to Base64: {}", input);
                byte[] imageBytes = restTemplate.getForObject(input, byte[].class);
                if (imageBytes != null && imageBytes.length > 0) return Base64.getEncoder().encodeToString(imageBytes);
            } catch (Exception e) {
                log.warn("Failed to download image from URL {}: {}", input, e.getMessage());
            }
        }

        // Strip data URL prefix
        if (input.contains(",")) return input.split(",")[1];

        return input;
    }
}
