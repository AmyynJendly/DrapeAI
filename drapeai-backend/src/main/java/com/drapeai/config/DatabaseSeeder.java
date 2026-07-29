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

    public static final List<Product> CURATED_PRODUCTS = List.of(
        Product.builder()
            .brand("Saint Laurent")
            .name("Double-Breasted Tuxedo Jacket in Grain de Poudre")
            .slug("double-breasted-tuxedo-jacket-in-grain-de-poudre")
            .description("Double-breasted, six-button tuxedo jacket made with certified wool, featuring a satin peaked lapel and satin-covered buttons.")
            .category("apparel")
            .price(3590.00)
            .imageUrl("/products/product1.png")
            .images(List.of("/products/product1.png", "/products/product1.1.png"))
            .fit("Tailored fit with padded shoulders")
            .materials("100% Certified Wool; 100% Silk lining")
            .careInstructions("Do not wash; Dry clean mild process; Iron at max 110°C without steam.")
            .highlights(List.of(
                "Double-breasted, six-button closure",
                "Satin peaked lapel and satin-covered buttons",
                "Padded shoulders and single back vent",
                "Two jetted flap pockets and one chest welt pocket",
                "Made in Italy"
            ))
            .build(),
        Product.builder()
            .brand("Dior")
            .name("Bar Jacket Black Wool, Silk and Lace")
            .slug("bar-jacket-black-wool-silk-and-lace")
            .description("The Bar jacket is reimagined through modern vision and House codes of refinement. Crafted in lightweight black wool and silk, it features a fitted silhouette elevated by tonal lace details at the hem and collar.")
            .category("apparel")
            .price(5300.00)
            .imageUrl("/products/product2.png")
            .images(List.of("/products/product2.png", "/products/product2.1.png", "/products/product2.2.png"))
            .fit("Fitted silhouette")
            .materials("77% Wool, 23% Silk; Lining: 100% Silk; Tonal lace details")
            .careInstructions("Treat with extra care and gently dry clean.")
            .highlights(List.of(
                "Front button closure with tonal CD horn buttons",
                "Tonal lace details at the hem and collar",
                "Buttoned cuffs and front flap pockets",
                "Full tonal silk lining",
                "Made in France"
            ))
            .build(),
        Product.builder()
            .brand("Dolce & Gabbana")
            .name("Majolica-Print Silk Dress")
            .slug("majolica-print-silk-dress")
            .description("Crafted from luxurious silk, this dress features Dolce & Gabbana's signature Mediterranean Majolica tile print. Designed with a fluid, feminine silhouette that celebrates traditional Italian ceramic art and craftsmanship.")
            .category("apparel")
            .price(4195.00)
            .imageUrl("/products/product3.png")
            .images(List.of("/products/product3.png"))
            .fit("Flowing silhouetted fit")
            .materials("100% Pure Silk")
            .careInstructions("Dry clean only; iron at low temperature; do not bleach.")
            .highlights(List.of(
                "Iconic Mediterranean Majolica tile print motif",
                "Pure silk fabric with elegant drape",
                "Concealed rear zip closure",
                "Fully lined",
                "Made in Italy"
            ))
            .build(),
        Product.builder()
            .brand("Dolce & Gabbana")
            .name("Long Lace Dress in Black")
            .slug("long-lace-dress-black")
            .description("A long sheer lace dress conveying Sicilian traditions with a contemporary edge. Crafted from stretch lace and tulle in iconic black, it offers a fitted silhouette that caresses the body like a second skin.")
            .category("apparel")
            .price(2645.00)
            .imageUrl("/products/product4.jpg")
            .images(List.of("/products/product4.jpg"))
            .fit("Fitted second-skin silhouette")
            .materials("82% Polyamide, 18% Spandex (Stretch Lace & Tulle)")
            .careInstructions("Dry clean only; do not bleach; iron at low temperature.")
            .highlights(List.of(
                "Sheer stretch-lace overlay",
                "Round neck and long sleeves",
                "Includes removable slip dress",
                "Sicilian-inspired capsule design",
                "Made in Italy"
            ))
            .build()
    );

    @Override
    public void run(String... args) {
        log.info("Refreshing database catalog with luxury product collection...");
        productRepository.deleteAll();
        productRepository.saveAll(CURATED_PRODUCTS);
        log.info("Successfully updated MongoDB with {} luxury products and local photo assets.", CURATED_PRODUCTS.size());
    }
}
