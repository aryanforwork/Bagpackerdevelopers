package com.bagpackers.agency.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AdminTokenFilter adminTokenFilter;
    private final RateLimitingFilter rateLimitingFilter;

    public SecurityConfig(AdminTokenFilter adminTokenFilter, RateLimitingFilter rateLimitingFilter) {
        this.adminTokenFilter = adminTokenFilter;
        this.rateLimitingFilter = rateLimitingFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .addFilterBefore(rateLimitingFilter, org.springframework.security.web.context.SecurityContextHolderFilter.class)
            .addFilterBefore(adminTokenFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/health",
                    "/api/v1/cases",
                    "/api/v1/cases/**",
                    "/api/v1/leads",
                    "/api/v1/sandbox/idp",
                    "/api/v1/enquiries",
                    "/api/v1/enquiries/**",
                    "/api/v1/metadata",
                    "/api/v1/auth/**"
                ).permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");
        if (allowedOriginsEnv != null && !allowedOriginsEnv.isEmpty()) {
            config.setAllowedOrigins(java.util.Arrays.asList(allowedOriginsEnv.split(",")));
        } else {
            config.setAllowedOrigins(List.of("http://localhost:3000", "https://bagpackers-frontend.vercel.app"));
        }
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
