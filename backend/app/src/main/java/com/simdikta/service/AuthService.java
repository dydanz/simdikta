package com.simdikta.service;

import com.simdikta.entity.User;
import com.simdikta.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordService passwordService;
    
    @Autowired
    private SessionService sessionService;
    
    /**
     * Login with email and password
     */
    public LoginResult login(String email, String password) {
        // Find user by email
        Optional<User> userOpt = userRepository.findByEmailAndDeleteStatusFalse(email);
        
        if (userOpt.isEmpty()) {
            return new LoginResult(false, "Invalid email or password", null);
        }
        
        User user = userOpt.get();
        
        // Check if user is verified
        if (!user.getVerified()) {
            return new LoginResult(false, "Please verify your email before logging in", null);
        }
        
        // Verify password
        if (!passwordService.verifyPassword(password, user.getPasswordHash())) {
            return new LoginResult(false, "Invalid email or password", null);
        }
        
        // Create session
        String sessionToken = sessionService.createSession(user.getId());
        
        return new LoginResult(true, "Login successful", sessionToken);
    }
    
    /**
     * Logout by expiring the session
     */
    public boolean logout(String sessionToken) {
        if (sessionToken == null || sessionToken.trim().isEmpty()) {
            return false;
        }
        
        sessionService.expireSession(sessionToken);
        return true;
    }
    
    /**
     * Check if a session is valid
     */
    public boolean isAuthenticated(String sessionToken) {
        return sessionService.isValidSession(sessionToken);
    }
    
    public static class LoginResult {
        private final boolean success;
        private final String message;
        private final String sessionToken;
        
        public LoginResult(boolean success, String message, String sessionToken) {
            this.success = success;
            this.message = message;
            this.sessionToken = sessionToken;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public String getMessage() {
            return message;
        }
        
        public String getSessionToken() {
            return sessionToken;
        }
    }
}