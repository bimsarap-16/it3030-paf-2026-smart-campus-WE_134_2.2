package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Technician;
import com.smartcampus.backend.repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;

import com.smartcampus.backend.service.EmailService;
import com.smartcampus.backend.util.PasswordValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    @Autowired
    private TechnicianRepository repository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Technician> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Technician technician) {
        if (!PasswordValidator.isValid(technician.getPassword())) {
            return ResponseEntity.badRequest().body(PasswordValidator.getValidationErrorMessage());
        }
        technician.setStatus("PENDING");
        return ResponseEntity.ok(repository.save(technician));
    }

    @PostMapping("/login")
    public Optional<Technician> login(@RequestBody Technician credentials) {
        return repository.findByEmail(credentials.getEmail())
                .filter(t -> t.getPassword().equals(credentials.getPassword()) && "APPROVED".equals(t.getStatus()));
    }

    @PatchMapping("/{id}/status")
    public Technician updateStatus(@PathVariable String id, @RequestBody String status) {
        Technician technician = repository.findById(id).orElseThrow();
        technician.setStatus(status.replace("\"", "")); // Strip quotes if sent as raw string
        return repository.save(technician);
    }

    @PutMapping("/{id}")
    public Technician update(@PathVariable String id, @RequestBody Technician updated) {
        updated.setId(id);
        return repository.save(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> req) {
    
        String email = req.get("email");
    
        if (email == null || email.trim().isEmpty()) return "Email is required";
    
        email = email.trim().toLowerCase();
    
        Optional<Technician> techOpt = repository.findByEmailIgnoreCase(email); 
    
        if (techOpt.isEmpty()) return "User not found";
    
        Technician tech = techOpt.get();
    
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
    
        tech.setResetOtp(otp);
        tech.setOtpExpiry(System.currentTimeMillis() + (5 * 60 * 1000));
    
        repository.save(tech);
    
        emailService.sendEmail(
            email,
            "Smart Uni System - Password Reset OTP",
            "Smart Uni System\n\n" +
            "OTP code for reset password:\n\n" +
            "Your OTP is: " + otp + "\n\n" +
            "Valid for 5 minutes"
        );
    
        return "OTP sent";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody Map<String, String> req) {
    
        String email = req.get("email");
        String otp = req.get("otp");
        String newPassword = req.get("newPassword");

        if (newPassword != null && !PasswordValidator.isValid(newPassword)) {
            return PasswordValidator.getValidationErrorMessage();
        }
    
        Optional<Technician> techOpt = repository.findByEmailIgnoreCase(email);
    
        if (techOpt.isEmpty()) return "User not found";
    
        Technician tech = techOpt.get();
    
        if (otp == null || tech.getResetOtp() == null || !otp.equals(tech.getResetOtp())) {
            return "Invalid OTP";
        }
    
        if (System.currentTimeMillis() > tech.getOtpExpiry()) return "OTP expired";
    
        tech.setPassword(newPassword);
        tech.setResetOtp(null);
        tech.setOtpExpiry(null);
    
        repository.save(tech);
    
        return "Password updated";
    }
}
