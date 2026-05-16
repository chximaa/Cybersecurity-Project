package com.security.service;

import com.security.dto.UserDTO;
import com.security.entity.User;
import com.security.repository.JwtTokenRepository;
import com.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    private final JwtTokenRepository jwtTokenRepository;
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::mapToUserDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Blacklister tous les tokens de l'utilisateur
        jwtTokenRepository.blacklistAllUserTokens(user);
        
        // Désactiver l'utilisateur au lieu de le supprimer
        user.setActive(false);
        userRepository.save(user);
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