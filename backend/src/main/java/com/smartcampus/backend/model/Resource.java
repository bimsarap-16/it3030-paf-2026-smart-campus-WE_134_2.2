package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;
    private String buildingId;
    private String name;
    private String type;
    private String floor;
    private int capacity;
    private int windows;
    private String features;
    private String status;
}
