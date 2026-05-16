package com.security.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// BUG 5 FIX: mise à jour complète vers l'API JJWT 0.12.x
// Méthodes supprimées dans 0.12.x : parserBuilder(), parseClaimsJws(), getBody(),
// setClaims(), setSubject(), setIssuedAt(), setExpiration(), signWith(key, alg)
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()                      // était: Jwts.parserBuilder()
                .verifyWith(getSigningKey())       // était: .setSigningKey(key)
                .build()
                .parseSignedClaims(token)          // était: .parseClaimsJws(token)
                .getPayload();                     // était: .getBody()
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, refreshExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, Long expiration) {
        return Jwts.builder()
                .claims(extraClaims)                                        // était: .setClaims()
                .subject(userDetails.getUsername())                         // était: .setSubject()
                .issuedAt(new Date(System.currentTimeMillis()))             // était: .setIssuedAt()
                .expiration(new Date(System.currentTimeMillis() + expiration)) // était: .setExpiration()
                .signWith(getSigningKey())                                   // était: .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public Long getExpirationTime() {
        return jwtExpiration;
    }
}
