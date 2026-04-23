package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository repository;

    @GetMapping("/user/{userName}")
    public List<Notification> getByUser(@PathVariable String userName) {
        return repository.findByRecipientOrderByCreatedAtDesc(userName);
    }

    @GetMapping("/user/{userName}/unread-count")
    public long getUnreadCount(@PathVariable String userName) {
        return repository.countByRecipientAndRead(userName, false);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        return repository.findById(id)
                .map(n -> {
                    n.setRead(true);
                    return ResponseEntity.ok(repository.save(n));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/user/{userName}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String userName) {
        List<Notification> unread = repository.findByRecipientOrderByCreatedAtDesc(userName);
        unread.forEach(n -> n.setRead(true));
        repository.saveAll(unread);
        return ResponseEntity.ok().build();
    }
}
