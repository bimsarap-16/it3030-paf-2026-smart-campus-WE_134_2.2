package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Admin;
import com.smartcampus.backend.repository.AdminRepository;
import com.smartcampus.backend.util.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminRepository repository;

    @GetMapping
    public List<Admin> getAll() {
        return repository.findAll();
    }

    @PostMapping("/login")
    public Optional<Admin> login(@RequestBody Admin admin) {
        return repository.findByUsername(admin.getUsername())
                .filter(u -> u.getPassword().equals(admin.getPassword()));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Admin admin) {
        if (!PasswordValidator.isValid(admin.getPassword())) {
            return ResponseEntity.badRequest().body(PasswordValidator.getValidationErrorMessage());
        }
        return ResponseEntity.ok(repository.save(admin));
    }
}
