package com.drapeai.controller;

import com.drapeai.model.User;
import com.drapeai.model.dto.AccountProfileResponse;
import com.drapeai.model.dto.UpdateAccountRequest;
import com.drapeai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<AccountProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(toResponse(loadCurrentUser(authentication)));
    }

    @PutMapping("/me")
    public ResponseEntity<AccountProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody UpdateAccountRequest request
    ) {
        User user = loadCurrentUser(authentication);

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getPreferredSize() != null) {
            user.setPreferredSize(request.getPreferredSize());
        }
        if (request.getStylePreference() != null) {
            user.setStylePreference(request.getStylePreference());
        }
        if (request.getNewsletterOptIn() != null) {
            user.setNewsletterOptIn(request.getNewsletterOptIn());
        }

        return ResponseEntity.ok(toResponse(userRepository.save(user)));
    }

    private User loadCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user is required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private AccountProfileResponse toResponse(User user) {
        return AccountProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .preferredSize(user.getPreferredSize())
                .stylePreference(user.getStylePreference())
                .newsletterOptIn(user.getNewsletterOptIn())
                .role(user.getRole())
                .build();
    }
}