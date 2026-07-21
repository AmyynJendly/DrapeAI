package com.drapeai.config;

import com.drapeai.model.Product;
import com.drapeai.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            log.info("Products collection is empty. Seeding initial product catalog...");

            List<Product> seedProducts = List.of(
                Product.builder()
                    .name("Retro White Sneakers")
                    .description("Classic retro white sneakers designed for everyday comfort and street style.")
                    .category("footwear")
                    .price(85.00)
                    .imageUrl("https://images.unsplash.com/photo-1549298916-b41d501d3772")
                    .build(),
                Product.builder()
                    .name("Urban Running Shoes")
                    .description("High-performance running shoes built for maximum cushioning and urban trail traction.")
                    .category("footwear")
                    .price(110.00)
                    .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff")
                    .build(),
                Product.builder()
                    .name("Classic Canvas Low-Tops")
                    .description("Timeless low-top canvas sneakers featuring durable stitching and flexible rubber soles.")
                    .category("footwear")
                    .price(55.00)
                    .imageUrl("https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77")
                    .build(),
                Product.builder()
                    .name("Minimalist Black Tee")
                    .description("Essential premium cotton t-shirt with a modern tailored fit in deep jet black.")
                    .category("apparel")
                    .price(28.00)
                    .imageUrl("https://images.unsplash.com/photo-1521572267360-ee0c2909d518")
                    .build(),
                Product.builder()
                    .name("Vintage Graphic Tee")
                    .description("Soft washed crewneck graphic tee with a relaxed retro aesthetic.")
                    .category("apparel")
                    .price(32.00)
                    .imageUrl("https://images.unsplash.com/photo-1503342217505-b0a15ec3261c")
                    .build(),
                Product.builder()
                    .name("Organic White Tee")
                    .description("Ultra-soft 100% organic cotton t-shirt crafted for breathability and effortless everyday style.")
                    .category("apparel")
                    .price(25.00)
                    .imageUrl("https://images.unsplash.com/photo-1581655353564-df123a1eb820")
                    .build(),
                Product.builder()
                    .name("Oversized Knit Pullover")
                    .description("Cozy oversized sweater crafted from plush yarn for relaxed warmth during cooler seasons.")
                    .category("apparel")
                    .price(65.00)
                    .imageUrl("https://images.unsplash.com/photo-1576566588028-4147f3842f27")
                    .build(),
                Product.builder()
                    .name("Classic Gray Hoodie")
                    .description("Mid-weight fleece pullover hoodie featuring a front pouch pocket and ribbed cuffs.")
                    .category("apparel")
                    .price(50.00)
                    .imageUrl("https://images.unsplash.com/photo-1556905055-8f358a7a47b2")
                    .build(),
                Product.builder()
                    .name("Cable-Knit Wool Sweater")
                    .description("Traditional cable-knit pullover made from premium wool blend for superior comfort.")
                    .category("apparel")
                    .price(75.00)
                    .imageUrl("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633")
                    .build(),
                Product.builder()
                    .name("Heavyweight Fleece Pull")
                    .description("Durable heavyweight fleece pullover built for outdoor warmth and minimalist appeal.")
                    .category("apparel")
                    .price(58.00)
                    .imageUrl("https://images.unsplash.com/photo-1509967419530-da38b4704bc6")
                    .build()
            );

            productRepository.saveAll(seedProducts);
            log.info("Successfully seeded {} products into MongoDB.", seedProducts.size());
        } else {
            log.info("Products collection already contains data ({} items). Skipping seed.", productRepository.count());
        }
    }
}
