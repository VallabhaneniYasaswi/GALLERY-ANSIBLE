package com.klef.model;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service 
public class JWTManager {
    public final String SEC_KEY="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890MKDJSHI";
    public final SecretKey key=Keys.hmacShaKeyFor(SEC_KEY.getBytes());
    
    // Generate token including email and role
    public String generateToken(String email) {
        Map<String, String> data = new HashMap<>();
        data.put("email", email);
        return Jwts.builder()
                   .setClaims(data)
                   .setIssuedAt(new Date())
                   .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
                   .signWith(key)
                   .compact(); 
    }


    // Validate token and return claims
    public Map<String, String> validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                                .setSigningKey(key)
                                .build()
                                .parseClaimsJws(token)
                                .getBody();
            Date expiry = claims.getExpiration();
            if(expiry == null || expiry.before(new Date()))
                return null; // token expired
            Map<String, String> result = new HashMap<>();
            result.put("email", claims.get("email", String.class));
            result.put("role", claims.get("role", String.class));
            return result;
        } catch(Exception e) {
            return null; // invalid token
        }
    }
}
