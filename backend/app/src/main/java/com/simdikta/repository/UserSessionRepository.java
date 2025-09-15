package com.simdikta.repository;

import com.simdikta.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    
    Optional<UserSession> findBySessionTokenAndStatus(String sessionToken, UserSession.SessionStatus status);
    
    @Query("SELECT us FROM UserSession us WHERE us.sessionToken = ?1 AND us.status = 'ACTIVE' AND us.expireAt > ?2")
    Optional<UserSession> findActiveSession(String sessionToken, LocalDateTime currentTime);
    
    @Modifying
    @Transactional
    @Query("UPDATE UserSession us SET us.status = 'EXPIRED' WHERE us.sessionToken = ?1")
    void expireSession(String sessionToken);
    
    @Modifying
    @Transactional
    @Query("UPDATE UserSession us SET us.status = 'EXPIRED' WHERE us.userId = ?1 AND us.status = 'ACTIVE'")
    void expireAllUserSessions(String userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE UserSession us SET us.status = 'EXPIRED' WHERE us.expireAt < ?1 AND us.status = 'ACTIVE'")
    void expireExpiredSessions(LocalDateTime currentTime);
}