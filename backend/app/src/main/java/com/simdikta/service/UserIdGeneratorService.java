package com.simdikta.service;

import com.simdikta.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class UserIdGeneratorService {
    
    @Autowired
    private UserRepository userRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyMMdd");
    
    public synchronized String generateUserId() {
        String datePrefix = LocalDate.now().format(DATE_FORMATTER);
        int maxSequence = userRepository.findMaxSequenceForDate(datePrefix);
        int nextSequence = maxSequence + 1;
        
        return String.format("%s%07d", datePrefix, nextSequence);
    }
}