package com.bagpackers.agency.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class JwtUtil {
    // 32-byte secret key for HMAC-SHA256
    private static final String SECRET = "dev-secure-admin-token-32-byte-secret-key-signature";

    public static String generateToken(String subject, long expirationMs) {
        try {
            String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
            String header = Base64.getUrlEncoder().withoutPadding().encodeToString(headerJson.getBytes(StandardCharsets.UTF_8));
            
            long now = System.currentTimeMillis();
            long exp = now + expirationMs;
            String payloadJson = String.format("{\"sub\":\"%s\",\"iat\":%d,\"exp\":%d}", subject, now / 1000, exp / 1000);
            String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));
            
            String signature = sign(header + "." + payload, SECRET);
            return header + "." + payload + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    public static boolean validateToken(String token, String expectedSubject) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;
            
            String header = parts[0];
            String payload = parts[1];
            String signature = parts[2];
            
            String expectedSignature = sign(header + "." + payload, SECRET);
            if (!signature.equals(expectedSignature)) return false;
            
            String payloadJson = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
            
            // Manual parsing of expiration timestamp
            if (!payloadJson.contains("\"exp\":")) return false;
            String expStr = payloadJson.split("\"exp\":")[1].split("}")[0].trim();
            long exp = Long.parseLong(expStr);
            if (System.currentTimeMillis() / 1000 > exp) {
                return false; // Expired
            }
            
            if (!payloadJson.contains("\"sub\":\"")) return false;
            String sub = payloadJson.split("\"sub\":\"")[1].split("\"")[0];
            return sub.equals(expectedSubject);
        } catch (Exception e) {
            return false;
        }
    }

    private static String sign(String data, String secret) throws Exception {
        Mac hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmac.init(secretKey);
        byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
    }
}
