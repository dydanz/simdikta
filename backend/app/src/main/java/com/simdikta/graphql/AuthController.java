package com.simdikta.graphql;

import com.simdikta.entity.User;
import com.simdikta.service.AuthService;
import com.simdikta.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

@Controller
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private SessionService sessionService;
    
    @MutationMapping
    public LoginPayload login(@Argument LoginInput input) {
        AuthService.LoginResult result = authService.login(input.getEmail(), input.getPassword());
        
        return new LoginPayload(
            result.isSuccess(),
            result.getMessage(),
            result.getSessionToken()
        );
    }
    
    @MutationMapping
    public LogoutPayload logout() {
        String sessionToken = getSessionTokenFromRequest();
        boolean success = authService.logout(sessionToken);
        
        return new LogoutPayload(
            success,
            success ? "Logged out successfully" : "Logout failed"
        );
    }
    
    @QueryMapping
    public User me() {
        String sessionToken = getSessionTokenFromRequest();
        if (sessionToken != null) {
            Optional<User> userOpt = sessionService.validateSession(sessionToken);
            if (userOpt.isPresent()) {
                return userOpt.get();
            }
        }
        throw new RuntimeException("Not authenticated");
    }
    
    private String getSessionTokenFromRequest() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attr.getRequest();
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
    
    // Input types
    public static class LoginInput {
        private String email;
        private String password;
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    // Payload types
    public static class LoginPayload {
        private final boolean success;
        private final String message;
        private final String sessionToken;
        
        public LoginPayload(boolean success, String message, String sessionToken) {
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
    
    public static class LogoutPayload {
        private final boolean success;
        private final String message;
        
        public LogoutPayload(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public String getMessage() {
            return message;
        }
    }
}