package com.drapeai.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userEmail;
    private List<OrderItem> items;
    private double subtotal;
    private double shippingFee;
    private double totalAmount;
    private ShippingAddress shippingAddress;

    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private String productId;
        private String name;
        private String imageUrl;
        private double price;
        private int quantity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingAddress {
        private String fullName;
        private String address;
        private String city;
        private String postalCode;
        private String country;
    }

    public enum OrderStatus {
        PENDING, PROCESSING, SHIPPED, DELIVERED
    }
}
