package com.drapeai.controller;

import com.drapeai.model.dto.CreateOrderRequest;
import com.drapeai.model.dto.OrderResponse;
import com.drapeai.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody CreateOrderRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication != null ? authentication.getName() : "guest@drapeai.com";
        return ResponseEntity.ok(orderService.createOrder(userEmail, request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(orderService.getUserOrders(authentication.getName()));
    }
}
