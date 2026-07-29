package com.drapeai.controller;

import com.drapeai.model.dto.TryOnRequest;
import com.drapeai.model.dto.TryOnResponse;
import com.drapeai.service.TryOnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/try-on")
@RequiredArgsConstructor
public class TryOnController {

    private final TryOnService tryOnService;

    @PostMapping
    public ResponseEntity<TryOnResponse> processTryOn(
            @RequestBody TryOnRequest request,
            Authentication authentication
    ) {
        String userEmail = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : "guest@drapeai.com";
        return ResponseEntity.ok(tryOnService.processTryOn(userEmail, request));
    }
}
