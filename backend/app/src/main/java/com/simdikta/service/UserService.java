package com.simdikta.service;

import com.simdikta.entity.User;
import com.simdikta.entity.UserVerification;
import com.simdikta.repository.UserRepository;
import com.simdikta.repository.UserVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserVerificationRepository verificationRepository;
    
    @Autowired
    private UserIdGeneratorService userIdGenerator;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$"
    );
    
    private final SecureRandom secureRandom = new SecureRandom();
    
    public CreateUserResult createUser(String email, String password, String retypePassword) {
        // Validate inputs
        if (email == null || email.trim().isEmpty()) {
            return new CreateUserResult(false, "Email is required", null);
        }
        
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            return new CreateUserResult(false, "Invalid email format", null);
        }
        
        if (password == null || password.length() < 8) {
            return new CreateUserResult(false, "Password must be at least 8 characters long", null);
        }
        
        if (!password.equals(retypePassword)) {
            return new CreateUserResult(false, "Passwords do not match", null);
        }
        
        email = email.trim().toLowerCase();
        
        // Check if user already exists
        if (userRepository.existsByEmailAndDeleteStatusFalse(email)) {
            return new CreateUserResult(false, "User with this email already exists", null);
        }
        
        try {
            // Create user
            String userId = userIdGenerator.generateUserId();
            String passwordHash = passwordEncoder.encode(password);
            
            User user = new User(userId, email, passwordHash);
            user = userRepository.save(user);
            
            // Create verification record
            String token = generateVerificationToken();
            LocalDateTime expireDate = LocalDateTime.now().plusDays(1);
            
            UserVerification verification = new UserVerification(userId, token, expireDate);
            verificationRepository.save(verification);
            
            // Send verification email
            emailService.sendVerificationEmail(email, token);
            
            return new CreateUserResult(true, "User created successfully. Please check your email for verification.", user);
            
        } catch (Exception e) {
            return new CreateUserResult(false, "Failed to create user: " + e.getMessage(), null);
        }
    }
    
    public VerifyUserResult verifyUser(String token) {
        if (token == null || token.trim().isEmpty()) {
            return new VerifyUserResult(false, "Token is required");
        }
        
        Optional<UserVerification> verificationOpt = verificationRepository.findByToken(token);
        if (verificationOpt.isEmpty()) {
            return new VerifyUserResult(false, "Invalid verification token");
        }
        
        UserVerification verification = verificationOpt.get();
        
        if (verification.isExpired()) {
            return new VerifyUserResult(false, "Verification token has expired");
        }
        
        if (verification.getStatus() == UserVerification.VerificationStatus.VERIFIED) {
            return new VerifyUserResult(false, "User is already verified");
        }
        
        // Verify user
        Optional<User> userOpt = userRepository.findById(verification.getUserId());
        if (userOpt.isEmpty()) {
            return new VerifyUserResult(false, "User not found");
        }
        
        User user = userOpt.get();
        user.setVerified(true);
        user.setUpdatedBy("system");
        userRepository.save(user);
        
        verification.setStatus(UserVerification.VerificationStatus.VERIFIED);
        verificationRepository.save(verification);
        
        return new VerifyUserResult(true, "Account verified successfully");
    }
    
    public LoginResult login(String email, String password) {
        if (email == null || email.trim().isEmpty()) {
            return new LoginResult(false, "Email is required", null, null);
        }
        
        if (password == null || password.isEmpty()) {
            return new LoginResult(false, "Password is required", null, null);
        }
        
        email = email.trim().toLowerCase();
        
        Optional<User> userOpt = userRepository.findByEmailAndDeleteStatusFalse(email);
        if (userOpt.isEmpty()) {
            return new LoginResult(false, "Invalid email or password", null, null);
        }
        
        User user = userOpt.get();
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return new LoginResult(false, "Invalid email or password", null, null);
        }
        
        if (!user.getVerified()) {
            return new LoginResult(false, "Please verify your email before logging in", null, null);
        }
        
        // In a real implementation, you would generate JWT token here
        String token = "mock_jwt_token_" + user.getId();
        
        return new LoginResult(true, "Login successful", token, user);
    }
    
    private String generateVerificationToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
    
    // Result classes
    public static class CreateUserResult {
        private final boolean success;
        private final String message;
        private final User user;
        
        public CreateUserResult(boolean success, String message, User user) {
            this.success = success;
            this.message = message;
            this.user = user;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public User getUser() { return user; }
    }
    
    public static class VerifyUserResult {
        private final boolean success;
        private final String message;
        
        public VerifyUserResult(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
    }
    
    public static class LoginResult {
        private final boolean success;
        private final String message;
        private final String token;
        private final User user;
        
        public LoginResult(boolean success, String message, String token, User user) {
            this.success = success;
            this.message = message;
            this.token = token;
            this.user = user;
        }
        
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getToken() { return token; }
        public User getUser() { return user; }
    }
}