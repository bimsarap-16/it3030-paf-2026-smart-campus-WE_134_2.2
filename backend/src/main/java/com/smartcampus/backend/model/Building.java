package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "buildings")
public class Building {
    @Id
    private String id;
    private String name;
    private String code;
    private int floors;
    private int resources;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public int getFloors() { return floors; }
    public void setFloors(int floors) { this.floors = floors; }
    public int getResources() { return resources; }
    public void setResources(int resources) { this.resources = resources; }
}
