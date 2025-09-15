package com.simdikta.graphql;

import com.simdikta.entity.User;
import com.simdikta.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @QueryMapping
    public String hello() {
        return "Hello from Simdikta GraphQL API!";
    }
    
    @MutationMapping
    public CreateUserPayload createUser(@Argument CreateUserInput input) {
        UserService.CreateUserResult result = userService.createUser(
            input.email(), 
            input.password(), 
            input.retypePassword()
        );
        
        return new CreateUserPayload(
            result.isSuccess(),
            result.getMessage(),
            result.getUser() != null ? new UserDto(result.getUser()) : null
        );
    }
    
    @MutationMapping
    public VerifyUserPayload verifyUser(@Argument String token) {
        UserService.VerifyUserResult result = userService.verifyUser(token);
        
        return new VerifyUserPayload(
            result.isSuccess(),
            result.getMessage()
        );
    }
    
    
    // Input records
    public record CreateUserInput(String email, String password, String retypePassword) {}
    
    // Payload records
    public record CreateUserPayload(boolean success, String message, UserDto user) {}
    public record VerifyUserPayload(boolean success, String message) {}
    
    // DTO record
    public record UserDto(String id, String email, boolean verified, String createdDate) {
        public UserDto(User user) {
            this(
                user.getId(),
                user.getEmail(),
                user.getVerified(),
                user.getCreatedDate().toString()
            );
        }
    }
}