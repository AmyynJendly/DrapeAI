package com.drapeai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    /**
     * RestTemplate with generous timeouts for AI API calls.
     * Connect timeout: 15s, Read timeout: 180s (Gradio queues can take a while).
     *
     * Note: RestTemplateBuilder.connectTimeout() was removed in Spring Boot 3.2+.
     * We use SimpleClientHttpRequestFactory directly instead.
     */
    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(15_000);  // 15 seconds
        factory.setReadTimeout(180_000);    // 3 minutes for AI queue waits
        return new RestTemplate(factory);
    }
}
