package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Lecturer;
import com.smartcampus.backend.repository.LecturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lecturers")
public class LecturerController {

    @Autowired
    private LecturerRepository repository;

    @GetMapping
    public List<Lecturer> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Lecturer create(@RequestBody Lecturer lecturer) {
        lecturer.setStatus("PENDING");
        return repository.save(lecturer);
    }

    @PostMapping("/login")
    public Optional<Lecturer> login(@RequestBody Lecturer credentials) {
        return repository.findByEmail(credentials.getEmail())
                .filter(l -> l.getPassword().equals(credentials.getPassword()) && "APPROVED".equals(l.getStatus()));
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
}
