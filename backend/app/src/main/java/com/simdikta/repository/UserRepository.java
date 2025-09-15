package com.simdikta.repository;

import com.simdikta.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmailAndDeleteStatusFalse(String email);
    
    boolean existsByEmailAndDeleteStatusFalse(String email);
    
    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(u.id, 7) AS int)), 0) FROM User u WHERE u.id LIKE ?1%")
    int findMaxSequenceForDate(String datePrefix);
}