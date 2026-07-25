package com.bagpackers.agency.controller;

import com.bagpackers.agency.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Value("${spring.security.admin-token:dev-secure-admin-token}")
    private String adminToken;

    // Access token lifetime: 15 minutes
    private static final long ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000;
    // Refresh token lifetime: 7 days
    private static final long REFRESH_TOKEN_EXPIRATION = 7L * 24 * 60 * 60 * 1000;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Map<String, String> credentials,
            HttpServletResponse response
    ) {
        String token = credentials.get("token");
        if (token == null || !token.trim().equals(adminToken)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Unauthorized");
            err.put("message", "Invalid admin security token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        // Generate Access and Refresh JWT tokens
        String accessToken = JwtUtil.generateToken("admin", ACCESS_TOKEN_EXPIRATION);
        String refreshToken = JwtUtil.generateToken("admin", REFRESH_TOKEN_EXPIRATION);

        // Set refresh token in HttpOnly cookie
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Always secure in production
        cookie.setPath("/");
        cookie.setMaxAge((int) (REFRESH_TOKEN_EXPIRATION / 1000));
        response.addCookie(cookie);

        Map<String, String> body = new HashMap<>();
        body.put("access_token", accessToken);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(
            @CookieValue(name = "refresh_token", required = false) String refreshToken
    ) {
        if (refreshToken == null || !JwtUtil.validateToken(refreshToken, "admin")) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Unauthorized");
            err.put("message", "Invalid or expired refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        // Issue new short-lived access token
        String newAccessToken = JwtUtil.generateToken("admin", ACCESS_TOKEN_EXPIRATION);

        Map<String, String> body = new HashMap<>();
        body.put("access_token", newAccessToken);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        // Clear HttpOnly refresh token cookie
        Cookie cookie = new Cookie("refresh_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        Map<String, String> body = new HashMap<>();
        body.put("message", "Logged out successfully");
        return ResponseEntity.ok(body);
    }
}
