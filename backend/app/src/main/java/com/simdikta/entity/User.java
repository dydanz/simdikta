package com.simdikta.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @Column(name = "id", nullable = false)
    private String id;
    
    @Column(unique = true, nullable = false)
    @Email
    @NotBlank
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    @NotBlank
    private String passwordHash;
    
    @Column(name = "created_date", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdDate;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @Column(name = "delete_status", nullable = false)
    private Boolean deleteStatus = false;
    
    @Column(name = "verified", nullable = false)
    private Boolean verified = false;
    
    @UpdateTimestamp
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    
    public User() {}
    
    public User(String id, String email, String passwordHash) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdBy = "system";
        this.updatedBy = "system";
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPasswordHash() {
        return passwordHash;
    }
    
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getUpdatedBy() {
        return updatedBy;
    }
    
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
    
    public Boolean getDeleteStatus() {
        return deleteStatus;
    }
    
    public void setDeleteStatus(Boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }
    
    public Boolean getVerified() {
        return verified;
    }
    
    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
    
    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }
    
    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }
}