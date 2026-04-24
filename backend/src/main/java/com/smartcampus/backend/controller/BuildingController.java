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




}