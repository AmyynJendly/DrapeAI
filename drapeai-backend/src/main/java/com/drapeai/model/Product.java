package com.drapeai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String brand;
    private String name;
    private String slug;
    private String description;
    private String category; // "apparel" or "footwear"
    private Double price;
    private String imageUrl;
    private String fit;
    private String materials;
    private String careInstructions;
    private List<String> highlights;
}
