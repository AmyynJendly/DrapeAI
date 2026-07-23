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

    private static final List<Product> CURATED_PRODUCTS = List.of(
        Product.builder()
            .brand("Zara")
            .name("Tailored Linen Blend Blazer")
            .slug("zara-tailored-linen-blend-blazer")
            .description("A softly structured linen blend blazer with a clean shoulder, refined lapel, and an easy drape for day-to-evening dressing.")
            .category("apparel")
            .price(129.00)
            .imageUrl("https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80")
            .fit("Relaxed tailored fit")
            .materials("Linen, viscose, polyester")
            .careInstructions("Dry clean only; steam lightly to restore shape.")
            .highlights(List.of("Single-breasted closure", "Fully lined", "Sharp shoulder line"))
            .build(),
        Product.builder()
            .brand("COS")
            .name("Pleated Wide-Leg Trouser")
            .slug("cos-pleated-wide-leg-trouser")
            .description("Fluid wide-leg trousers cut with a sharp front crease and generous movement for a polished everyday silhouette.")
            .category("apparel")
            .price(110.00)
            .imageUrl("https://images.unsplash.com/photo-1506629905607-920f2f6f4c1b?auto=format&fit=crop&w=800&q=80")
            .fit("High rise, relaxed leg")
            .materials("Recycled polyester, wool blend")
            .careInstructions("Machine wash cold inside out; hang dry.")
            .highlights(List.of("Pressed front crease", "Side pockets", "Invisible waistband closure"))
            .build(),
        Product.builder()
            .brand("Mango")
            .name("Soft Knit Polo Sweater")
            .slug("mango-soft-knit-polo-sweater")
            .description("A lightweight knit polo with a clean collar and compact rib trim, designed for layering through transitional weather.")
            .category("apparel")
            .price(79.00)
            .imageUrl("https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80")
            .fit("Regular fit")
            .materials("Cotton, modal")
            .careInstructions("Machine wash delicate; reshape while damp.")
            .highlights(List.of("Open polo collar", "Ribbed cuffs", "Breathable knit texture"))
            .build(),
        Product.builder()
            .brand("Massimo Dutti")
            .name("Leather Minimal Chelsea Boot")
            .slug("massimo-dutti-leather-minimal-chelsea-boot")
            .description("Sleek Chelsea boots in smooth leather with a refined square toe and low stacked heel for a modern tailored finish.")
            .category("footwear")
            .price(189.00)
            .imageUrl("https://images.unsplash.com/photo-1520639888713-7851133c9e6b?auto=format&fit=crop&w=800&q=80")
            .fit("True to size")
            .materials("Leather upper, rubber sole")
            .careInstructions("Wipe clean with a soft cloth; condition regularly.")
            .highlights(List.of("Elastic side panels", "Pull tab", "Durable grip sole"))
            .build(),
        Product.builder()
            .brand("Aritzia")
            .name("Structured Tank Bodysuit")
            .slug("aritzia-structured-tank-bodysuit")
            .description("A smooth, body-skimming tank bodysuit with a square neckline and clean finish that layers seamlessly under tailoring.")
            .category("apparel")
            .price(58.00)
            .imageUrl("https://images.unsplash.com/photo-1503342394128-c104d54dba50?auto=format&fit=crop&w=800&q=80")
            .fit("Slim fit")
            .materials("Modal, elastane")
            .careInstructions("Machine wash cold; line dry.")
            .highlights(List.of("Snap closure", "Double-layer front", "Smooth stretch finish"))
            .build(),
        Product.builder()
            .brand("AllSaints")
            .name("Oversized Graphic Hoodie")
            .slug("allsaints-oversized-graphic-hoodie")
            .description("An oversized fleece hoodie with a washed graphic print and a substantial hand feel for a laid-back streetwear look.")
            .category("apparel")
            .price(98.00)
            .imageUrl("https://images.unsplash.com/photo-1509046196345-4f0fc3c5a03c?auto=format&fit=crop&w=800&q=80")
            .fit("Oversized fit")
            .materials("Cotton fleece")
            .careInstructions("Machine wash cold with like colors; tumble dry low.")
            .highlights(List.of("Kangaroo pocket", "Dropped shoulders", "Soft brushed interior"))
            .build(),
        Product.builder()
            .brand("Adidas")
            .name("Retro Court Sneaker")
            .slug("adidas-retro-court-sneaker")
            .description("A low-profile court sneaker with vintage-inspired lines, cushioned footbed, and clean panel detailing for everyday wear.")
            .category("footwear")
            .price(105.00)
            .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80")
            .fit("True to size")
            .materials("Leather upper, textile lining, rubber outsole")
            .careInstructions("Spot clean only.")
            .highlights(List.of("Padded collar", "Rubber cupsole", "Classic lace-up closure"))
            .build(),
        Product.builder()
            .brand("Mango")
            .name("Poplin Button Shirt")
            .slug("mango-poplin-button-shirt")
            .description("A crisp poplin shirt with a relaxed silhouette, sharp collar, and versatile proportions suited to both office and off-duty styling.")
            .category("apparel")
            .price(69.00)
            .imageUrl("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80")
            .fit("Relaxed fit")
            .materials("Organic cotton poplin")
            .careInstructions("Machine wash warm; iron while slightly damp.")
            .highlights(List.of("Curved hem", "Chest pocket", "Button cuff detail"))
            .build(),
        Product.builder()
            .brand("COS")
            .name("Boxy Wool Coat")
            .slug("cos-boxy-wool-coat")
            .description("A boxy wool coat with a minimal front and cocooning volume, designed to layer over knitwear and tailoring alike.")
            .category("apparel")
            .price(249.00)
            .imageUrl("https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80")
            .fit("Relaxed oversized fit")
            .materials("Wool, polyester lining")
            .careInstructions("Dry clean only.")
            .highlights(List.of("Hidden button placket", "Deep patch pockets", "Dropped shoulder"))
            .build(),
        Product.builder()
            .brand("Zara")
            .name("Slim Leather Loafer")
            .slug("zara-slim-leather-loafer")
            .description("A refined slim loafer in polished leather with a lightweight profile that sharpens tailored and casual looks.")
            .category("footwear")
            .price(139.00)
            .imageUrl("https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80")
            .fit("Runs slightly narrow")
            .materials("Leather upper, leather lining, synthetic sole")
            .careInstructions("Clean and polish regularly; store with shoe trees.")
            .highlights(List.of("Soft square toe", "Low stacked heel", "Slip-on construction"))
            .build()
    );

    @Override
    public void run(String... args) {
        if (shouldRefreshCatalog()) {
            log.info("Refreshing product catalog with curated storefront items...");
            productRepository.deleteAll();
            productRepository.saveAll(CURATED_PRODUCTS);
            log.info("Successfully seeded {} products into MongoDB.", CURATED_PRODUCTS.size());
        } else {
            // Update any existing unoptimized Unsplash URLs in database
            List<Product> existingProducts = productRepository.findAll();
            boolean updated = false;
            for (Product p : existingProducts) {
                if (p.getImageUrl() != null && p.getImageUrl().contains("images.unsplash.com") && !p.getImageUrl().contains("?")) {
                    p.setImageUrl(p.getImageUrl() + "?auto=format&fit=crop&w=600&q=80");
                    updated = true;
                }
            }
            if (updated) {
                productRepository.saveAll(existingProducts);
                log.info("Updated existing products with optimized image URLs.");
            }
        }
    }

    private boolean shouldRefreshCatalog() {
        if (productRepository.count() == 0) {
            return true;
        }

        return productRepository.findAll().stream()
                .noneMatch(product -> product.getBrand() != null && !product.getBrand().isBlank());
    }
}
