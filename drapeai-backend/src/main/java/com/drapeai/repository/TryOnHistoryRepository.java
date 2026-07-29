package com.drapeai.repository;

import com.drapeai.model.TryOnHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TryOnHistoryRepository extends MongoRepository<TryOnHistory, String> {
    List<TryOnHistory> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
