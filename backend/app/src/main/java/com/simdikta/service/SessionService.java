package com.simdikta.service;

import com.simdikta.entity.User;
import com.simdikta.entity.UserSession;
import com.simdikta.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService {
    
    @Autowired
    private UserSessionRepository sessionRepository;
    
    /**
     * Create a new session for a user
     */
    public String createSession(String userId) {
        // Generate a secure session token
        String sessionToken = UUID.randomUUID().toString();
        
        // Set expiration to 1 hour from now
        LocalDateTime expireAt = LocalDateTime.now().plusHours(1);
        
        // Expire any existing active sessions for this user (optional - single session per user)
        sessionRepository.expireAllUserSessions(userId);
        
        // Create and save new session
        UserSession session = new UserSession(userId, sessionToken, expireAt);
        sessionRepository.save(session);
        
        return sessionToken;
    }
    
    /**
     * Validate a session token and return the associated user
     */
    public Optional<User> validateSession(String sessionToken) {
        if (sessionToken == null || sessionToken.trim().isEmpty()) {
            return Optional.empty();
        }
        
        Optional<UserSession> sessionOpt = sessionRepository.findActiveSession(
            sessionToken, LocalDateTime.now()
        );
        
        if (sessionOpt.isPresent()) {
            UserSession session = sessionOpt.get();
            if (!session.isExpired()) {
                return Optional.of(session.getUser());
            } else {
                // Session is expired, mark it as such
                expireSession(sessionToken);
            }
        }
        
        return Optional.empty();
    }
    
    /**
     * Expire a specific session
     */
    public void expireSession(String sessionToken) {
        sessionRepository.expireSession(sessionToken);
    }
    
    /**
     * Expire all sessions for a user
     */
    public void expireAllUserSessions(String userId) {
        sessionRepository.expireAllUserSessions(userId);
    }
    
    /**
     * Clean up expired sessions automatically every hour
     */
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupExpiredSessions() {
        sessionRepository.expireExpiredSessions(LocalDateTime.now());
    }
    
    /**
     * Check if a session token is valid
     */
    public boolean isValidSession(String sessionToken) {
        return validateSession(sessionToken).isPresent();
    }
}