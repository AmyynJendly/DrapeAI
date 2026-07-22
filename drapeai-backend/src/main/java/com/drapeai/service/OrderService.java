package com.drapeai.service;

import com.drapeai.model.Order;
import com.drapeai.model.dto.CreateOrderRequest;
import com.drapeai.model.dto.OrderResponse;
import com.drapeai.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderResponse createOrder(String userEmail, CreateOrderRequest request) {
        log.info("Creating new order for user: {}", userEmail);

        double subtotal = request.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        double totalAmount = subtotal + request.getShippingFee();

        Order order = Order.builder()
                .userEmail(userEmail != null ? userEmail : "guest@drapeai.com")
                .items(request.getItems())
                .subtotal(subtotal)
                .shippingFee(request.getShippingFee())
                .totalAmount(totalAmount)
                .shippingAddress(request.getShippingAddress())
                .status(Order.OrderStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        Order saved = orderRepository.save(order);

        return mapToResponse(saved);
    }

    public List<OrderResponse> getUserOrders(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrdersAdmin() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse updateOrderStatus(String orderId, String newStatusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(newStatusStr.toUpperCase());
        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userEmail(order.getUserEmail())
                .items(order.getItems())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
