package com.simdikta.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    
    private final BCryptPasswordEncoder passwordEncoder;
    
    public PasswordService() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }
    
    /**
     * Hash a plain text password using BCrypt
     */
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
    
    /**
     * Verify a plain text password against a hashed password
     */
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
}