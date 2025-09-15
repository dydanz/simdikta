package com.simdikta.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    public void sendVerificationEmail(String email, String token) {
        String verificationUrl = frontendUrl + "/verify?token=" + token;
        
        logger.info("=== MOCK EMAIL SERVICE ===");
        logger.info("To: {}", email);
        logger.info("Subject: Verify your Simdikta account");
        logger.info("Verification URL: {}", verificationUrl);
        logger.info("========================");
        
        // In a real implementation, you would integrate with an email service like:
        // - AWS SES
        // - SendGrid
        // - SMTP server
        // - etc.
    }
}