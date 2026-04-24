package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Lecturer;
import com.smartcampus.backend.repository.LecturerRepository;
import com.smartcampus.backend.service.EmailService;
import com.smartcampus.backend.util.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/lecturers")
public class LecturerController {

    @Autowired
    private LecturerRepository repository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Lecturer> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Lecturer lecturer) {
        if (!PasswordValidator.isValid(lecturer.getPassword())) {
            return ResponseEntity.badRequest().body(PasswordValidator.getValidationErrorMessage());
        }

        lecturer.setStatus("PENDING");
        return ResponseEntity.ok(repository.save(lecturer));
    }

    @PostMapping("/login")
    public Optional<Lecturer> login(@RequestBody Lecturer credentials) {
    
        String email = credentials.getEmail().trim().toLowerCase();
    
        return repository.findByEmailIgnoreCase(email)
                .filter(l -> l.getPassword().equals(credentials.getPassword())
                        && "APPROVED".equals(l.getStatus()));
    }

    @PatchMapping("/{id}/status")
    public Lecturer updateStatus(@PathVariable String id, @RequestBody String status) {
        Lecturer lecturer = repository.findById(id).orElseThrow();
        lecturer.setStatus(status.replace("\"", ""));
        return repository.save(lecturer);
    }

    @PutMapping("/{id}")
    public Lecturer update(@PathVariable String id, @RequestBody Lecturer updated) {
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
    
        if (email == null || email.trim().isEmpty()) {
            return "Email is required";
        }
    
        email = email.trim().toLowerCase();
    
        Optional<Lecturer> lecturerOpt = repository.findByEmailIgnoreCase(email);
    
        if (lecturerOpt.isEmpty()) {
            return "User not found";
        }
    
        Lecturer lecturer = lecturerOpt.get();
    
        // 🔢 generate 6-digit OTP
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
    
        lecturer.setResetOtp(otp);
        lecturer.setOtpExpiry(System.currentTimeMillis() + (5 * 60 * 1000)); // 5 mins
    
        repository.save(lecturer);
    
        // 📧 send OTP
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
    
        if (email == null || otp == null || newPassword == null) {
            return "All fields required";
        }

        if (!PasswordValidator.isValid(newPassword)) {
            return PasswordValidator.getValidationErrorMessage();
        }
    
        email = email.trim().toLowerCase();
    
        Optional<Lecturer> lecturerOpt = repository.findByEmailIgnoreCase(email);
    
        if (lecturerOpt.isEmpty()) {
            return "User not found";
        }
    
        Lecturer lecturer = lecturerOpt.get();
    
        // ❌ OTP mismatch
        if (!otp.equals(lecturer.getResetOtp())) {
            return "Invalid OTP";
        }
    
        // ❌ expired
        if (System.currentTimeMillis() > lecturer.getOtpExpiry()) {
            return "OTP expired";
        }
    
        // ✅ update password
        lecturer.setPassword(newPassword);
    
        // clear OTP
        lecturer.setResetOtp(null);
        lecturer.setOtpExpiry(null);
    
        repository.save(lecturer);
    
        return "Password updated";
    }



}
