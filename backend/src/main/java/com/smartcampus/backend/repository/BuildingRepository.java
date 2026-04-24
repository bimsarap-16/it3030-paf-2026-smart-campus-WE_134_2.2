package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Building;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingRepository extends MongoRepository<Building, String> {
}
