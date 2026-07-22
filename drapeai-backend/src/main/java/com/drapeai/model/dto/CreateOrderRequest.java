package com.drapeai.model.dto;

import com.drapeai.model.Order.OrderItem;
import com.drapeai.model.Order.ShippingAddress;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private List<OrderItem> items;
    private double shippingFee;
    private ShippingAddress shippingAddress;
}
