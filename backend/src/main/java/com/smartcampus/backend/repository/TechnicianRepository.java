package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Technician;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnicianRepository extends MongoRepository<Technician, String> {
    Optional<Technician> findByEmail(String email);
}
