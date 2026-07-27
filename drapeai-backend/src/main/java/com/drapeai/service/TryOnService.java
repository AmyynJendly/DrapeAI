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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TryOnService {

    private final ProductRepository productRepository;
    private final TryOnHistoryRepository tryOnHistoryRepository;
    private final RestTemplate restTemplate;

    @Value("${vto.hf.token:}")
    private String hfToken;

    @Value("${vto.colab.url:}")
    private String colabUrl;

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    public TryOnResponse processTryOn(String userEmail, TryOnRequest request) {
        log.info("Processing AI Try-On for product {} by user {}", request.getProductId(), userEmail);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));

        String resultImageUrl = generateResultImage(product, request.getUserImage(), request.getCategory());

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

    // ─────────────────────────────────────────────────────────────────────────
    // 3-Tier AI Pipeline
    // ─────────────────────────────────────────────────────────────────────────

    private String generateResultImage(Product product, String userImageData, String category) {

        // Tier 1: Try Colab/ngrok endpoint (fastest, user-controlled)
        if (StringUtils.hasText(colabUrl)) {
            try {
                String result = callColabEndpoint(userImageData, product.getImageUrl(), category);
                if (StringUtils.hasText(result)) {
                    log.info("Colab VTO succeeded for product {}", product.getId());
                    return result;
                }
            } catch (Exception e) {
                log.warn("Colab VTO failed ({}), falling back to HF Gradio...", e.getMessage());
            }
        }

        // Tier 2: Try HF Gradio space (Nymbo/Virtual-Try-On) via REST API
        try {
            String result = callHuggingFaceGradio(userImageData, product.getImageUrl(), category);
            if (StringUtils.hasText(result)) {
                log.info("HF Gradio VTO succeeded for product {}", product.getId());
                return result;
            }
        } catch (Exception e) {
            log.warn("HF Gradio VTO failed ({}), using graceful fallback...", e.getMessage());
        }

        // Tier 3: Graceful fallback — return the garment image URL so the UI still shows something
        log.info("Using fallback garment image for product {}", product.getId());
        return product.getImageUrl();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tier 1: Colab Endpoint
    // ─────────────────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private String callColabEndpoint(String userImageBase64, String garmentImageUrl, String category) {
        log.info("Calling Colab VTO endpoint: {}", colabUrl);

        // Map DrapeAI categories to Colab model categories
        String colabCategory = mapToColabCategory(category);

        // Field names must exactly match the Colab FastAPI TryOnRequest Pydantic model
        Map<String, Object> payload = new HashMap<>();
        payload.put("user_image_url", userImageBase64);   // base64 data URL of person
        payload.put("garment_image_url", garmentImageUrl); // product image URL
        payload.put("category", colabCategory);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ngrok-skip-browser-warning", "true"); // bypass ngrok browser warning page

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(colabUrl, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<?, ?> body = response.getBody();
            // Colab returns { "status": "success", "result_url": "..." }
            for (String key : new String[]{"result_url", "output_url", "image_url", "result", "output"}) {
                Object val = body.get(key);
                if (val instanceof String s && StringUtils.hasText(s)) {
                    return s;
                }
            }
        }

        throw new RuntimeException("Colab returned empty or invalid response");
    }

    /**
     * Maps DrapeAI product categories to Colab model category strings.
     * The Colab script uses these to determine the mask placement region.
     */
    private String mapToColabCategory(String category) {
        if (category == null) return "tops";
        return switch (category.toLowerCase()) {
            case "footwear", "shoes", "sneakers", "boots" -> "shoes";
            case "bottoms", "pants", "jeans", "skirts", "shorts" -> "bottoms";
            case "apparel", "tops", "shirts", "jackets", "coats", "dresses" -> "tops";
            default -> "tops"; // safe fallback
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tier 2: Hugging Face Gradio REST (Nymbo/Virtual-Try-On)
    //
    // Gradio REST API flow:
    //   POST /queue/join  → get event_id
    //   GET  /queue/data?session_hash=... → SSE stream → parse 'process_completed'
    // ─────────────────────────────────────────────────────────────────────────

    private static final String HF_SPACE_BASE = "https://nymbo-virtual-try-on.hf.space";
    private static final int GRADIO_POLL_MAX_ATTEMPTS = 60;   // 60 × 3s = 3 minutes max
    private static final long GRADIO_POLL_INTERVAL_MS = 3000;

    @SuppressWarnings("unchecked")
    private String callHuggingFaceGradio(String userImageBase64, String garmentImageUrl, String category) throws Exception {
        log.info("Calling HF Gradio space: {}", HF_SPACE_BASE);

        HttpHeaders baseHeaders = new HttpHeaders();
        baseHeaders.setContentType(MediaType.APPLICATION_JSON);
        baseHeaders.setAccept(List.of(MediaType.APPLICATION_JSON));
        if (StringUtils.hasText(hfToken)) {
            baseHeaders.set("Authorization", "Bearer " + hfToken);
        }

        // Step 1: Download garment image bytes and person image bytes (Gradio needs uploaded files or URLs)
        // We'll use the /upload endpoint first for the user's base64 image, then pass garment URL as-is
        String sessionHash = UUID.randomUUID().toString().replace("-", "").substring(0, 10);

        // Build the Gradio predict payload.
        // Nymbo/Virtual-Try-On /predict endpoint inputs match the IDM-VTON Gradio space:
        // [dict_img (person), garment_img, garment_description, is_checked, is_checked_crop, denoise_steps, seed]
        Map<String, Object> personImgDict = new HashMap<>();
        personImgDict.put("background", buildGradioImageRef(userImageBase64, "person.jpg", baseHeaders));
        personImgDict.put("layers", List.of());
        personImgDict.put("composite", null);

        Object garmentImgRef = buildGradioImageRefFromUrl(garmentImageUrl, "garment.jpg", baseHeaders);

        String garmentDesc = category != null ? category : "clothing item";

        List<Object> inputs = List.of(
                personImgDict,
                garmentImgRef,
                garmentDesc,
                true,  // is_checked (auto mask)
                true,  // is_checked_crop (auto crop)
                30,    // denoise_steps
                42     // seed
        );

        Map<String, Object> joinPayload = new HashMap<>();
        joinPayload.put("data", inputs);
        joinPayload.put("fn_index", 0);
        joinPayload.put("session_hash", sessionHash);
        joinPayload.put("trigger_id", 6);

        HttpEntity<Map<String, Object>> joinEntity = new HttpEntity<>(joinPayload, baseHeaders);
        ResponseEntity<Map> joinResponse = restTemplate.postForEntity(
                HF_SPACE_BASE + "/queue/join", joinEntity, Map.class);

        if (!joinResponse.getStatusCode().is2xxSuccessful() || joinResponse.getBody() == null) {
            throw new RuntimeException("HF Gradio queue/join failed: " + joinResponse.getStatusCode());
        }

        log.info("HF Gradio job queued (session_hash={}), polling for result...", sessionHash);

        // Step 2: Poll queue/data SSE endpoint for completion
        return pollGradioResult(sessionHash, baseHeaders);
    }

    @SuppressWarnings("unchecked")
    private String pollGradioResult(String sessionHash, HttpHeaders baseHeaders) throws Exception {
        String dataUrl = HF_SPACE_BASE + "/queue/data?session_hash=" + sessionHash;

        HttpHeaders sseHeaders = new HttpHeaders(baseHeaders);
        sseHeaders.setAccept(List.of(MediaType.TEXT_EVENT_STREAM, MediaType.ALL));

        for (int attempt = 0; attempt < GRADIO_POLL_MAX_ATTEMPTS; attempt++) {
            Thread.sleep(GRADIO_POLL_INTERVAL_MS);

            try {
                HttpEntity<Void> req = new HttpEntity<>(sseHeaders);
                ResponseEntity<String> sseResponse = restTemplate.exchange(
                        dataUrl, HttpMethod.GET, req, String.class);

                String body = sseResponse.getBody();
                if (body == null) continue;

                // Parse SSE lines for process_completed event
                for (String line : body.split("\n")) {
                    if (!line.startsWith("data:")) continue;
                    String json = line.substring(5).trim();
                    if (!json.contains("process_completed")) continue;

                    // Extract output image URL from JSON
                    String result = extractImageUrlFromGradioResponse(json);
                    if (StringUtils.hasText(result)) {
                        return result;
                    }
                }
            } catch (Exception e) {
                log.debug("Poll attempt {} failed: {}", attempt + 1, e.getMessage());
            }
        }

        throw new RuntimeException("HF Gradio polling timed out after " + GRADIO_POLL_MAX_ATTEMPTS + " attempts");
    }

    /**
     * Uploads a base64 image to the HF Gradio /upload endpoint and returns the file reference object.
     * Falls back to returning a data URL object if upload fails.
     */
    @SuppressWarnings("unchecked")
    private Object buildGradioImageRef(String base64DataUrl, String filename, HttpHeaders baseHeaders) {
        try {
            // Strip data URL prefix if present
            String base64 = base64DataUrl;
            String mimeType = "image/jpeg";
            if (base64DataUrl.startsWith("data:")) {
                int commaIdx = base64DataUrl.indexOf(',');
                String header = base64DataUrl.substring(5, commaIdx);
                mimeType = header.split(";")[0];
                base64 = base64DataUrl.substring(commaIdx + 1);
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64);

            HttpHeaders uploadHeaders = new HttpHeaders();
            uploadHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);
            if (StringUtils.hasText(hfToken)) {
                uploadHeaders.set("Authorization", "Bearer " + hfToken);
            }

            ByteArrayResource resource = new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return filename;
                }
            };

            MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
            formData.add("files", resource);

            HttpEntity<MultiValueMap<String, Object>> uploadEntity = new HttpEntity<>(formData, uploadHeaders);
            ResponseEntity<List> uploadResponse = restTemplate.postForEntity(
                    HF_SPACE_BASE + "/upload", uploadEntity, List.class);

            if (uploadResponse.getStatusCode().is2xxSuccessful()
                    && uploadResponse.getBody() != null
                    && !uploadResponse.getBody().isEmpty()) {
                // Returns {"path": "...", "url": "..."}
                Object fileRef = uploadResponse.getBody().get(0);
                if (fileRef instanceof String path) {
                    Map<String, Object> ref = new HashMap<>();
                    ref.put("path", path);
                    ref.put("url", HF_SPACE_BASE + "/file=" + path);
                    return ref;
                }
                return fileRef;
            }
        } catch (Exception e) {
            log.warn("Failed to upload person image to HF Gradio: {}", e.getMessage());
        }

        // Fallback: return data URL object
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("url", base64DataUrl);
        return fallback;
    }

    /**
     * Downloads the garment image from a URL and uploads it to Gradio, or returns a URL reference.
     */
    @SuppressWarnings("unchecked")
    private Object buildGradioImageRefFromUrl(String imageUrl, String filename, HttpHeaders baseHeaders) {
        try {
            byte[] imageBytes = restTemplate.getForObject(imageUrl, byte[].class);
            if (imageBytes == null || imageBytes.length == 0) throw new RuntimeException("Empty image");

            HttpHeaders uploadHeaders = new HttpHeaders();
            uploadHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);
            if (StringUtils.hasText(hfToken)) {
                uploadHeaders.set("Authorization", "Bearer " + hfToken);
            }

            ByteArrayResource resource = new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() { return filename; }
            };

            MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
            formData.add("files", resource);

            HttpEntity<MultiValueMap<String, Object>> uploadEntity = new HttpEntity<>(formData, uploadHeaders);
            ResponseEntity<List> uploadResponse = restTemplate.postForEntity(
                    HF_SPACE_BASE + "/upload", uploadEntity, List.class);

            if (uploadResponse.getStatusCode().is2xxSuccessful()
                    && uploadResponse.getBody() != null
                    && !uploadResponse.getBody().isEmpty()) {
                Object fileRef = uploadResponse.getBody().get(0);
                if (fileRef instanceof String path) {
                    Map<String, Object> ref = new HashMap<>();
                    ref.put("path", path);
                    ref.put("url", HF_SPACE_BASE + "/file=" + path);
                    return ref;
                }
                return fileRef;
            }
        } catch (Exception e) {
            log.warn("Failed to upload garment image to HF Gradio: {}", e.getMessage());
        }

        // Fallback: return URL reference
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("url", imageUrl);
        return fallback;
    }

    /**
     * Parses the Gradio SSE process_completed JSON to extract the output image URL.
     */
    private String extractImageUrlFromGradioResponse(String json) {
        try {
            // Simple string-based extraction (avoids adding Jackson dependency complexity)
            // Look for "url":"..." patterns in the output array
            int outputIdx = json.indexOf("\"output\"");
            if (outputIdx < 0) {
                outputIdx = json.indexOf("\"data\"");
            }

            // Search for URL patterns after "output" key
            String searchRegion = json.substring(Math.max(0, outputIdx));

            // Try to find a URL in the JSON that looks like an image
            int urlIdx = searchRegion.indexOf("\"url\"");
            while (urlIdx >= 0) {
                int colonIdx = searchRegion.indexOf(':', urlIdx);
                int startQuote = searchRegion.indexOf('"', colonIdx + 1);
                int endQuote = searchRegion.indexOf('"', startQuote + 1);
                if (startQuote >= 0 && endQuote > startQuote) {
                    String candidate = searchRegion.substring(startQuote + 1, endQuote);
                    if (candidate.startsWith("http") && (
                            candidate.contains(".jpg") || candidate.contains(".png") ||
                            candidate.contains(".webp") || candidate.contains("/file=") ||
                            candidate.contains("gradio"))) {
                        return candidate;
                    }
                }
                urlIdx = searchRegion.indexOf("\"url\"", urlIdx + 1);
            }

            // Second pass: look for any http image URL in the response
            int idx = json.indexOf("https://");
            while (idx >= 0) {
                int end = json.indexOf('"', idx);
                if (end > idx) {
                    String candidate = json.substring(idx, end);
                    if (candidate.contains("gradio") || candidate.contains(".jpg") ||
                            candidate.contains(".png") || candidate.contains("/file=")) {
                        return candidate;
                    }
                }
                idx = json.indexOf("https://", idx + 1);
            }
        } catch (Exception e) {
            log.debug("Error parsing Gradio response: {}", e.getMessage());
        }
        return null;
    }
}
