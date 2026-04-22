package com.smartcampus.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.Ticket.Comment;
import com.smartcampus.backend.repository.TicketRepository;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository repository;

    @GetMapping
    public List<Ticket> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        if (ticket.getStatus() == null) {
            ticket.setStatus("OPEN");
        }
        if (ticket.getProgressStatus() == null) {
            ticket.setProgressStatus("Not Started");
        }
        return repository.save(ticket);
    }

    @PutMapping("/{id}")
    public Ticket update(@PathVariable String id, @RequestBody Ticket updated) {
        return repository.findById(id)
                .map(old -> {
                    updated.setId(id);
                    return repository.save(updated);
                })
                .orElseGet(() -> {
                    updated.setId(id);
                    return repository.save(updated);
                });
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Ticket> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {

        Optional<Ticket> opt = repository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = opt.get();

        Comment comment = Comment.create(
                body.get("authorName"),
                body.get("authorRole"),
                body.get("text")
        );

        if (ticket.getComments() == null) {
            ticket.setComments(new ArrayList<>());
        }

        ticket.getComments().add(comment);

        return ResponseEntity.ok(repository.save(ticket));
    }
}