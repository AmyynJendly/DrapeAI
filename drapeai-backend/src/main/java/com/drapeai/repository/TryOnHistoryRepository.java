package com.drapeai.repository;

import com.drapeai.model.TryOnHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TryOnHistoryRepository extends MongoRepository<TryOnHistory, String> {
    List<TryOnHistory> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
