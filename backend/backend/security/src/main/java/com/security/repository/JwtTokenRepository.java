package com.security.repository;

import com.security.entity.JwtToken;
import com.security.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.repository.query.Param;

@Repository
public interface JwtTokenRepository extends JpaRepository<JwtToken, Long> {
    
    Optional<JwtToken> findByToken(String token);
    
    @Modifying
    @Transactional
    @Query("UPDATE JwtToken j SET j.isBlacklisted = true WHERE j.user = :user")
    void blacklistAllUserTokens(@Param("user") User user);
    
    @Modifying
    @Transactional
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}