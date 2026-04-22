package com.smartcampus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String recipient; // Lecturer Name
    private String message;
    private String type;      // e.g., "BOOKING", "TICKET"
    private boolean read;
    private LocalDateTime createdAt;

    public static Notification create(String recipient, String message, String type) {
        return Notification.builder()
                .recipient(recipient)
                .message(message)
                .type(type)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
