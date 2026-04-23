package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Technician;
import com.smartcampus.backend.repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    @Autowired
    private TechnicianRepository repository;

    @GetMapping
    public List<Technician> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Technician create(@RequestBody Technician technician) {
        technician.setStatus("PENDING");
        return repository.save(technician);
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
}
