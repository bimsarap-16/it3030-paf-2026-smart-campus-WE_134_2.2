package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "technicians")
public class Technician {
    @Id
    private String id;
    private String name;
    private String email;
    private String spec;
    private String empId;
    private String password;
    private String status; // PENDING, APPROVED, REJECTED

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
