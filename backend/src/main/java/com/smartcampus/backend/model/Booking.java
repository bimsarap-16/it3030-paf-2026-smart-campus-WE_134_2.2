package com.smartcampus.backend.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String lecturer;
    private String resource;
    private String building;
    private String date;
    private String time;
    private String purpose;
    private String status;
    private String reason; // for rejection reason
}
