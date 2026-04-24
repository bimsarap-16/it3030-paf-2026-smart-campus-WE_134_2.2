package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Lecturer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LecturerRepository extends MongoRepository<Lecturer, String> {
    Optional<Lecturer> findByEmail(String email);

    Optional<Lecturer> findByEmailIgnoreCase(String email);
}
