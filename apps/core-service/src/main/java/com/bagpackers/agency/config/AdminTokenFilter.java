package com.bagpackers.agency.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class AdminTokenFilter extends OncePerRequestFilter {

    @Value("${spring.security.admin-token:dev-secure-admin-token}")
    private String adminToken;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (isAdminPath(path, method)) {
            String token = request.getHeader("X-Admin-Token");
            String authHeader = request.getHeader("Authorization");
            boolean authorized = false;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7);
                if (com.bagpackers.agency.utils.JwtUtil.validateToken(jwt, "admin")) {
                    authorized = true;
                }
            }

            if (!authorized && token != null) {
                if (com.bagpackers.agency.utils.JwtUtil.validateToken(token, "admin") || token.equals(adminToken)) {
                    authorized = true;
                }
            }

            if (!authorized) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid or missing authentication credentials\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean isAdminPath(String path, String method) {
        // 1. Stats and analytics are admin-only
        if (path.startsWith("/api/v1/admin/")) {
            return true;
        }
        // 2. Reading all metadata profiles is admin-only
        if (path.startsWith("/api/v1/metadata/all")) {
            return true;
        }
        // 3. Modifying metadata (POST/DELETE) is admin-only
        if (path.startsWith("/api/v1/metadata") && (method.equals("POST") || method.equals("DELETE") || method.equals("PUT"))) {
            return true;
        }
        // 4. Listing enquiries or lead conversions (GET) should be admin-only
        if (path.startsWith("/api/v1/enquiries") && method.equals("GET")) {
            return true;
        }
        if (path.startsWith("/api/v1/leads") && method.equals("GET")) {
            return true;
        }
        return false;
    }
}
