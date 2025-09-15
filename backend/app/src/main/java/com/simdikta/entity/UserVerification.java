package com.simdikta.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_verifications")
public class UserVerification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @Column(name = "expire_date", nullable = false)
    private LocalDateTime expireDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status = VerificationStatus.PENDING;
    
    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
    
    public enum VerificationStatus {
        PENDING, VERIFIED
    }
    
    public UserVerification() {}
    
    public UserVerification(String userId, String token, LocalDateTime expireDate) {
        this.userId = userId;
        this.token = token;
        this.expireDate = expireDate;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public LocalDateTime getExpireDate() {
        return expireDate;
    }
    
    public void setExpireDate(LocalDateTime expireDate) {
        this.expireDate = expireDate;
    }
    
    public VerificationStatus getStatus() {
        return status;
    }
    
    public void setStatus(VerificationStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expireDate);
    }
}