package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonProperty;

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
    private String availableFrom; // ISO format: 2026-04-23T14:00

      @Field("estimatedResolveTime")
    @JsonProperty("estimatedResolveTime")
    private String estimatedResolveTime = "";

    public String getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(String availableFrom) { this.availableFrom = availableFrom; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBuildingId() { return buildingId; }
    public void setBuildingId(String buildingId) { this.buildingId = buildingId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public int getWindows() { return windows; }
    public void setWindows(int windows) { this.windows = windows; }
    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
