package com.simdikta.repository;

import com.simdikta.entity.UserVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserVerificationRepository extends JpaRepository<UserVerification, Long> {
    
    Optional<UserVerification> findByToken(String token);
    
    Optional<UserVerification> findByUserIdAndStatus(String userId, UserVerification.VerificationStatus status);
    
    void deleteByExpireDateBefore(LocalDateTime expireDate);
}