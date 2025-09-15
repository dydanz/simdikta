package com.simdikta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GraphQLConfig implements WebMvcConfigurer {
    
    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer() {
        return wiringBuilder -> {
            // Configure runtime wiring here if needed
        };
    }
    
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/graphql")
                .allowedOriginPatterns("http://localhost:3000", "http://localhost:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}