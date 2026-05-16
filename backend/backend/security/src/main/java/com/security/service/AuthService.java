package com.security.service;

import com.security.dto.*;
import com.security.entity.JwtToken;
import com.security.entity.Role;
import com.security.entity.User;
import com.security.repository.JwtTokenRepository;
import com.security.repository.UserRepository;
import com.security.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtTokenRepository jwtTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Le nom d'utilisateur est déjà pris");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("L'email est déjà utilisé");
        }
        
        // Créer le nouvel utilisateur
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .role(Role.ROLE_USER)
            .isActive(true)
            .createdAt(LocalDateTime.now())
            .build();
        
        user = userRepository.save(user);
        
        // Générer les tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        // Sauvegarder le token
        saveToken(accessToken, user);
        
        return buildAuthResponse(accessToken, refreshToken, user);
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsernameOrEmail(),
                request.getPassword()
            )
        );
        
        User user = (User) authentication.getPrincipal();
        
        // Mettre à jour la dernière connexion
        userRepository.updateLastLogin(user.getId(), LocalDateTime.now());
        
        // Blacklister tous les anciens tokens
        jwtTokenRepository.blacklistAllUserTokens(user);
        
        // Générer de nouveaux tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        // Sauvegarder le nouveau token
        saveToken(accessToken, user);
        
        return buildAuthResponse(accessToken, refreshToken, user);
    }
    
    @Transactional
    public void logout(String token) {
        jwtTokenRepository.findByToken(token).ifPresent(jwtToken -> {
            jwtToken.setBlacklisted(true);
            jwtTokenRepository.save(jwtToken);
        });
    }
    
    private void saveToken(String token, User user) {
        JwtToken jwtToken = JwtToken.builder()
            .token(token)
            .user(user)
            .isBlacklisted(false)
            .expiresAt(LocalDateTime.now().plusSeconds(jwtService.getExpirationTime() / 1000))
            .build();
        jwtTokenRepository.save(jwtToken);
    }
    
    private AuthResponse buildAuthResponse(String accessToken, String refreshToken, User user) {
        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(jwtService.getExpirationTime())
            .user(mapToUserDTO(user))
            .build();
    }
    
    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .isActive(user.isActive())
            .createdAt(user.getCreatedAt())
            .lastLogin(user.getLastLogin())
            .build();
    }
}