package com.java_project.ScholarHub.Models;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "assignments")
@Data
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private SubjectNew subjectNew;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private User professor;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_marks")
    private Integer maxMarks = 100;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "is_draft")
    private Boolean isDraft = false;

    @Column(name = "attachment_url")
    private String attachmentUrl;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Timestamp.from(Instant.now());
        if (this.startDate == null) {
            this.startDate = LocalDate.now();
        }
    }
}
