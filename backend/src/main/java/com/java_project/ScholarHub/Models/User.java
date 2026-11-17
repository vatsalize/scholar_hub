package com.java_project.ScholarHub.Models;

import com.java_project.ScholarHub.StringListConverter;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_details")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "email", unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password_hash")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role = Role.STUDENT;

    @Column(name = "department")
    private String department;

    @Column(name = "designation")
    private String designation;

    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "student_id")
    private String studentId;

    @Column(name = "semester")
    private String semester;

    @Column(name = "university")
    private String university;

    @Column(name = "office_room")
    private String officeRoom;

    @Column(name = "office_hours")
    private String officeHours;

    @Column(name = "avatar", length = 500)
    private String avatar;

    @Column(name = "is_verified", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isVerified = true;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Timestamp.from(Instant.now());
        if (this.role == null) {
            this.role = Role.STUDENT;
        }
        if (this.isVerified == null) {
            this.isVerified = true;
        }
    }

    @Column(name = "bio", length = 1000)
    private String bio;

    @Convert(converter = StringListConverter.class)
    @Column(name = "skills", columnDefinition = "TEXT")
    private List<String> skills;

    @Column(name = "is_available", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isAvailable = false;

}
