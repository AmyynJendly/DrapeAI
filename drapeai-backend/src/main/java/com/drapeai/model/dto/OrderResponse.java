package com.drapeai.model.dto;

import com.drapeai.model.Order.OrderItem;
import com.drapeai.model.Order.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private String userEmail;
    private List<OrderItem> items;
    private double subtotal;
    private double shippingFee;
    private double totalAmount;
    private ShippingAddress shippingAddress;
    private String status;
    private Instant createdAt;
}
