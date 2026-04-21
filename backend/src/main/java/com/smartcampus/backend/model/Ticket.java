package com.unifacility.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String lecturer;
    private String issue;
    private String resource;
    private String priority;
    private String status;
    private String progressStatus = "Not Started";
    private String assignedTo;

    private String response;

    // Additional fields from lecturer dashboard
    private String course;
    private String category;
    private String issueDesc;

    // Comments thread
    private List<Comment> comments = new ArrayList<>();

    @Data
    public static class Comment {
        private String id;
        private String authorName;
        private String authorRole;   // LECTURER | TECHNICIAN | ADMIN
        private String text;
        private String timestamp;

        public static Comment create(String authorName, String authorRole, String text) {
            Comment c = new Comment();
            c.setId(UUID.randomUUID().toString());
            c.setAuthorName(authorName);
            c.setAuthorRole(authorRole);
            c.setText(text);
            c.setTimestamp(Instant.now().toString());
            return c;
        }
    }
}

