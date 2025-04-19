package com.medical_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Autorise toutes les routes
                .allowedOrigins("http://localhost:5173") // Autorise le frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Autorise ces méthodes HTTP
                .allowedHeaders("*") // Autorise tous les en-têtes
                .allowCredentials(true); // Autorise les identifiants (si tu utilises des cookies ou HTTP Basic Auth)
    }
}
