package com.java_project.ScholarHub.Models;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "subject_enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"subject_id", "student_id"})
})
@Data
public class SubjectEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectNew subjectNew;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "enrolled_at")
    private Timestamp enrolledAt;

    @PrePersist
    public void prePersist() {
        this.enrolledAt = Timestamp.from(Instant.now());
    }
}
