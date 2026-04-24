package com.smartcampus.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.smartcampus.backend.model.Lecturer;
import com.smartcampus.backend.model.Technician;
import com.smartcampus.backend.repository.LecturerRepository;
import com.smartcampus.backend.repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        String credential = request.get("credential");
        String role = request.get("role"); // "lecturer" or "technician"

        try {
            // Verify the Google ID token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList("924077679471-7n30isnfc2vfubbdrbi3d6tjdnq4fc1d.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid Google token"));
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            Map<String, Object> response = new HashMap<>();

            if ("technician".equals(role)) {
                Optional<Technician> existing = technicianRepository.findByEmail(email);
                if (existing.isPresent()) {
                    // Existing user — login
                    Technician tech = existing.get();
                    if (!"APPROVED".equals(tech.getStatus())) {
                        return ResponseEntity.status(403).body(Map.of("error", "Account pending approval"));
                    }
                    response.put("user", tech);
                    response.put("isNew", false);
                } else {
                    // New user — register
                    Technician technician = new Technician();
                    technician.setName(name);
                    technician.setEmail(email);
                    technician.setPassword("GOOGLE_AUTH");
                    technician.setSpec("");
                    technician.setEmpId("");
                    technician.setStatus("PENDING");
                    Technician saved = technicianRepository.save(technician);
                    response.put("user", saved);
                    response.put("isNew", true);
                }
            } else {
                // Default: lecturer
                Optional<Lecturer> existing = lecturerRepository.findByEmail(email);
                if (existing.isPresent()) {
                    // Existing user — login
                    Lecturer lecturer = existing.get();
                    if (!"APPROVED".equals(lecturer.getStatus())) {
                        return ResponseEntity.status(403).body(Map.of("error", "Account pending approval"));
                    }
                    response.put("user", lecturer);
                    response.put("isNew", false);
                } else {
                    // New user — register
                    Lecturer lecturer = new Lecturer();
                    lecturer.setName(name);
                    lecturer.setEmail(email);
                    lecturer.setPassword("GOOGLE_AUTH");
                    lecturer.setDept("");
                    lecturer.setEmpId("");
                    lecturer.setStatus("PENDING");
                    Lecturer saved = lecturerRepository.save(lecturer);
                    response.put("user", saved);
                    response.put("isNew", true);
                }
            }

            response.put("name", name);
            response.put("email", email);
            response.put("picture", pictureUrl);
            response.put("role", role);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }
}
