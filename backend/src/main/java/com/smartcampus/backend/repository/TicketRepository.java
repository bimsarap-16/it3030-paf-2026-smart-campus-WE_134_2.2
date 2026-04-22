package com.smartcampus.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.smartcampus.backend.model.Ticket;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByLecturer(String lecturer);
}