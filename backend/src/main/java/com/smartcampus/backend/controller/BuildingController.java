package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Building;
import com.smartcampus.backend.repository.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    @Autowired
    private BuildingRepository repository;

    @GetMapping
    public List<Building> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Building create(@RequestBody Building building) {
        return repository.save(building);
    }

    
    @PutMapping("/{id}")
    public Building update(@PathVariable String id, @RequestBody Building updated) {
        updated.setId(id);
        return repository.save(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }




}