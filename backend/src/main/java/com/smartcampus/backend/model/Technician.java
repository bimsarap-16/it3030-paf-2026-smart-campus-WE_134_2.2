package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "technicians")
public class Technician {
    @Id
    private String id;
    private String name;
    private String email;
    private String spec;
    private String empId;
    private String password;
    private String status; 
    private String resetOtp;
    private Long otpExpiry;// PENDING, APPROVED, REJECTED

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSpec() { return spec; }
    public void setSpec(String spec) { this.spec = spec; }
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResetOtp() { return resetOtp; }
    public void setResetOtp(String resetOtp) { this.resetOtp = resetOtp; }
    
    public Long getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(Long otpExpiry) { this.otpExpiry = otpExpiry; }
}
