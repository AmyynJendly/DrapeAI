package com.drapeai.repository;

import com.drapeai.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
