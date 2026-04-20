package com.smartcampus.backend.controller;


import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceRepository repository;

    @GetMapping
    public List<Resource> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Resource create(@RequestBody Resource resource) {
        return repository.save(resource);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable String id, @RequestBody Resource updated) {
        updated.setId(id);
        return repository.save(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }
}
