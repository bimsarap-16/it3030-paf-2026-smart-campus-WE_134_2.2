package com.unifacility.backend.controller;

import com.unifacility.backend.model.Notification;
import com.unifacility.backend.model.Ticket;
import com.unifacility.backend.model.Ticket.Comment;
import com.unifacility.backend.repository.NotificationRepository;
import com.unifacility.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository repository;

    @Autowired
    private NotificationRepository notificationRepository;

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

    @GetMapping("/lecturer/{lecturer}")
    public List<Ticket> getByLecturer(@PathVariable String lecturer) {
        return repository.findByLecturer(lecturer);
    }

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        if (ticket.getStatus() == null)
            ticket.setStatus("OPEN");
        if (ticket.getProgressStatus() == null)
            ticket.setProgressStatus("Not Started");
        Ticket saved = repository.save(ticket);

        // Notify Admin
        notificationRepository.save(Notification.create(
            "ADMIN",
            String.format("New ticket: %s from %s.", saved.getIssue(), saved.getLecturer()),
            "TICKET"
        ));

        // Notify Technicians (General recipient)
        notificationRepository.save(Notification.create(
            "TECHNICIAN",
            String.format("New incident reported: %s at %s.", saved.getIssue(), saved.getResource()),
            "TICKET"
        ));

        return saved;
    }

    @PutMapping("/{id}")
    public Ticket update(@PathVariable String id, @RequestBody Ticket updated) {
        return repository.findById(id).map(old -> {
            boolean responseAdded = (old.getResponse() == null && updated.getResponse() != null) ||
                                   (old.getResponse() != null && !old.getResponse().equals(updated.getResponse()));
            
            if (responseAdded) {
                notificationRepository.save(Notification.create(
                    updated.getLecturer(),
                    String.format("Technician has responded to your ticket: %s.", updated.getIssue()),
                    "TICKET"
                ));
            }
            
            updated.setId(id);
            return repository.save(updated);
        }).orElseGet(() -> {
            updated.setId(id);
            return repository.save(updated);
        });
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }

    // ── Comments ─────────────────────────────────────────────────────────────

    /** Add a new comment */
    @PostMapping("/{id}/comments")
    public ResponseEntity<Ticket> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {

        Optional<Ticket> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Ticket ticket = opt.get();
        Comment comment = Comment.create(
                body.get("authorName"),
                body.get("authorRole"),
                body.get("text")
        );
        
        if (ticket.getComments() == null) {
            ticket.setComments(new java.util.ArrayList<>());
        }
        
        ticket.getComments().add(comment);
        Ticket saved = repository.save(ticket);

        String authorName = body.get("authorName");
        String authorRole = body.get("authorRole"); // Assuming "ADMIN", "TECHNICIAN", or "LECTURER"

        // Notify Admin (if not the author)
        if (!"ADMIN".equalsIgnoreCase(authorRole)) {
            notificationRepository.save(Notification.create(
                "ADMIN",
                String.format("%s commented on ticket: %s.", authorName, saved.getIssue()),
                "COMMENTS"
            ));
        }

        // Notify Technicians (if not the author)
        if (!"TECHNICIAN".equalsIgnoreCase(authorRole)) {
            notificationRepository.save(Notification.create(
                "TECHNICIAN",
                String.format("%s commented on ticket: %s.", authorName, saved.getIssue()),
                "COMMENTS"
            ));
        }

        // Notify Lecturer (if not the author)
        if (!saved.getLecturer().equalsIgnoreCase(authorName)) {
            notificationRepository.save(Notification.create(
                saved.getLecturer(),
                String.format("%s commented on your ticket: %s.", authorName, saved.getIssue()),
                "COMMENTS"
            ));
        }

        return ResponseEntity.ok(saved);
    }

    /** Edit an existing comment — only author is enforced on frontend; backend checks name match */
    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<Ticket> editComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @RequestBody Map<String, String> body) {

        Optional<Ticket> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Ticket ticket = opt.get();
        String requestingAuthor = body.get("authorName");

        ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId) && c.getAuthorName().equals(requestingAuthor))
                .findFirst()
                .ifPresent(c -> c.setText(body.get("text")));

        return ResponseEntity.ok(repository.save(ticket));
    }

    /** Delete a comment — only by original author */
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<Ticket> deleteComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @RequestParam String authorName) {

        Optional<Ticket> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Ticket ticket = opt.get();
        ticket.getComments().removeIf(
                c -> c.getId().equals(commentId) && c.getAuthorName().equals(authorName)
        );
        return ResponseEntity.ok(repository.save(ticket));
    }
}
