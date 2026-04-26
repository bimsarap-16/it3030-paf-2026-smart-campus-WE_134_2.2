package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookings")
@Data
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
    private String createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLecturer() { return lecturer; }
    public void setLecturer(String lecturer) { this.lecturer = lecturer; }
    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
