package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository repository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<Booking> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Booking create(@RequestBody Booking booking) {
        // default values
        if(booking.getStatus() == null) booking.setStatus("PENDING");
        if(booking.getCreatedAt() == null) {
            booking.setCreatedAt(java.time.LocalDate.now().toString());
        }
        
        Booking saved = repository.save(booking);

        // Notify Admin
        notificationRepository.save(Notification.create(
            "ADMIN",
            String.format("New booking request from %s for %s.", saved.getLecturer(), saved.getResource()),
            "BOOKING"
        ));

        return saved;
    }

    @PutMapping("/{id}")
    public Booking update(@PathVariable String id, @RequestBody Booking updated) {
        return repository.findById(id).map(old -> {
            boolean statusChanged = !old.getStatus().equals(updated.getStatus());
            if (statusChanged && !"PENDING".equals(updated.getStatus())) {
                String msg = String.format("Your booking for %s on %s has been %s.", 
                    updated.getResource(), updated.getDate(), updated.getStatus());
                
                if ("REJECTED".equals(updated.getStatus()) && updated.getReason() != null) {
                    msg += " Reason: " + updated.getReason();
                }

                notificationRepository.save(Notification.create(
                    updated.getLecturer(), 
                    msg, 
                    "BOOKING"
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
}
