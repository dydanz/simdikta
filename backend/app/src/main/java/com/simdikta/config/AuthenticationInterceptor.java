package com.simdikta.config;

import com.simdikta.entity.User;
import com.simdikta.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Component
public class AuthenticationInterceptor implements WebGraphQlInterceptor {
    
    @Autowired
    private SessionService sessionService;
    
    @Override
    @NonNull
    public Mono<WebGraphQlResponse> intercept(@NonNull WebGraphQlRequest request, @NonNull Chain chain) {
        // Extract session token from headers
        String sessionToken = request.getHeaders().getFirst("Authorization");
        if (sessionToken != null && sessionToken.startsWith("Bearer ")) {
            sessionToken = sessionToken.substring(7); // Remove "Bearer " prefix
        }
        
        // Validate session and get user
        Optional<User> userOpt = Optional.empty();
        if (sessionToken != null) {
            userOpt = sessionService.validateSession(sessionToken);
        }
        
        // For now, just proceed with the original request
        // The authentication context can be handled in individual resolvers
        return chain.next(request);
    }
}