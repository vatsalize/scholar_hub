package com.java_project.ScholarHub.Controllers;

import com.java_project.ScholarHub.DTOs.MessageResponse;
import com.java_project.ScholarHub.Models.*;
import com.java_project.ScholarHub.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/professor")
public class ProfessorController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentSubmissionRepository submissionRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private SubjectEnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectNewRepository subjectRepository;

    private User resolveProfessor(String professorIdStr) {
        if (professorIdStr == null || professorIdStr.isBlank()) {
            return userRepository.findByEmail("dr.vance@scholarhub.edu")
                    .orElseGet(() -> userRepository.findAll().stream().filter(u -> u.getRole() == Role.PROFESSOR).findFirst().orElse(null));
        }
        try {
            UUID id = UUID.fromString(professorIdStr);
            return userRepository.findById(id).orElseGet(() ->
                    userRepository.findByEmail("dr.vance@scholarhub.edu").orElse(null)
            );
        } catch (Exception e) {
            return userRepository.findByEmail("dr.vance@scholarhub.edu")
                    .orElseGet(() -> userRepository.findAll().stream().filter(u -> u.getRole() == Role.PROFESSOR).findFirst().orElse(null));
        }
    }

    // --- Assignments ---
    @PostMapping("/assignments/create")
    public ResponseEntity<?> createAssignment(@RequestBody Map<String, Object> payload) {
        try {
            String profIdStr = payload.get("professorId") != null ? payload.get("professorId").toString() : null;
            User prof = resolveProfessor(profIdStr);

            if (prof == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Professor not found"));
            }

            Assignment assignment = new Assignment();
            assignment.setProfessor(prof);

            if (payload.containsKey("subjectId") && payload.get("subjectId") != null) {
                try {
                    UUID subjectId = UUID.fromString(payload.get("subjectId").toString());
                    subjectRepository.findById(subjectId).ifPresent(assignment::setSubjectNew);
                } catch (Exception ignored) {}
            }

            assignment.setTitle(payload.getOrDefault("title", "New Assignment").toString());
            assignment.setDescription((String) payload.get("description"));
            if (payload.containsKey("maxMarks")) {
                assignment.setMaxMarks(Integer.parseInt(payload.get("maxMarks").toString()));
            }
            if (payload.containsKey("deadline")) {
                assignment.setDeadline(LocalDate.parse(payload.get("deadline").toString()));
            }
            if (payload.containsKey("isDraft")) {
                assignment.setIsDraft(Boolean.parseBoolean(payload.get("isDraft").toString()));
            }
            if (payload.containsKey("attachmentUrl")) {
                assignment.setAttachmentUrl((String) payload.get("attachmentUrl"));
            }

            Assignment saved = assignmentRepository.save(assignment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating assignment: " + e.getMessage()));
        }
    }

    @GetMapping("/assignments/getAll")
    public ResponseEntity<?> getAssignmentsDefault() {
        return getAssignmentsByProfessor(null);
    }

    @GetMapping("/assignments/getAll/{professorId}")
    public ResponseEntity<?> getAssignmentsByProfessor(@PathVariable(required = false) String professorId) {
        User prof = resolveProfessor(professorId);
        if (prof == null) {
            return ResponseEntity.ok(assignmentRepository.findAll());
        }
        List<Assignment> assignments = assignmentRepository.findByProfessor(prof);
        return ResponseEntity.ok(assignments);
    }

    @DeleteMapping("/assignments/delete/{assignmentId}")
    public ResponseEntity<?> deleteAssignment(@PathVariable UUID assignmentId) {
        assignmentRepository.deleteById(assignmentId);
        return ResponseEntity.ok(new MessageResponse("Assignment deleted successfully"));
    }

    // --- Submissions ---
    @GetMapping("/submissions/byAssignment/{assignmentId}")
    public ResponseEntity<?> getSubmissions(@PathVariable UUID assignmentId) {
        Optional<Assignment> assignment = assignmentRepository.findById(assignmentId);
        if (assignment.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Assignment not found"));
        }
        List<AssignmentSubmission> submissions = submissionRepository.findByAssignment(assignment.get());
        return ResponseEntity.ok(submissions);
    }

    @PutMapping("/submissions/evaluate/{submissionId}")
    public ResponseEntity<?> evaluateSubmission(@PathVariable UUID submissionId, @RequestBody Map<String, Object> payload) {
        Optional<AssignmentSubmission> subOpt = submissionRepository.findById(submissionId);
        if (subOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Submission not found"));
        }
        AssignmentSubmission submission = subOpt.get();
        if (payload.containsKey("score")) {
            submission.setScore(Double.parseDouble(payload.get("score").toString()));
        }
        if (payload.containsKey("feedback")) {
            submission.setFeedback(payload.get("feedback").toString());
        }
        submission.setStatus("EVALUATED");
        submission.setEvaluatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
        submissionRepository.save(submission);
        return ResponseEntity.ok(submission);
    }

    // --- Announcements ---
    @PostMapping("/announcements/create")
    public ResponseEntity<?> createAnnouncement(@RequestBody Map<String, Object> payload) {
        try {
            String profIdStr = payload.get("professorId") != null ? payload.get("professorId").toString() : null;
            User prof = resolveProfessor(profIdStr);
            if (prof == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Professor not found"));
            }

            Announcement ann = new Announcement();
            ann.setProfessor(prof);
            ann.setTitle(payload.getOrDefault("title", "New Announcement").toString());
            ann.setContent(payload.getOrDefault("content", "").toString());

            if (payload.containsKey("subjectId") && payload.get("subjectId") != null && !payload.get("subjectId").toString().isEmpty()) {
                try {
                    UUID subjectId = UUID.fromString(payload.get("subjectId").toString());
                    subjectRepository.findById(subjectId).ifPresent(ann::setSubjectNew);
                } catch (Exception ignored) {}
            }

            if (payload.containsKey("priority")) {
                ann.setPriority(payload.get("priority").toString());
            }

            Announcement saved = announcementRepository.save(ann);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating announcement: " + e.getMessage()));
        }
    }

    @GetMapping("/announcements/getAll")
    public ResponseEntity<?> getAnnouncementsDefault() {
        return getAnnouncements(null);
    }

    @GetMapping("/announcements/getAll/{professorId}")
    public ResponseEntity<?> getAnnouncements(@PathVariable(required = false) String professorId) {
        User prof = resolveProfessor(professorId);
        if (prof == null) {
            return ResponseEntity.ok(announcementRepository.findAll());
        }
        List<Announcement> list = announcementRepository.findByProfessorOrderByCreatedAtDesc(prof);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/announcements/delete/{announcementId}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable UUID announcementId) {
        announcementRepository.deleteById(announcementId);
        return ResponseEntity.ok(new MessageResponse("Announcement deleted successfully"));
    }

    // --- Enrolled Students ---
    @GetMapping("/students/bySubject/{subjectId}")
    public ResponseEntity<?> getStudentsBySubject(@PathVariable UUID subjectId) {
        Optional<SubjectNew> subj = subjectRepository.findById(subjectId);
        if (subj.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Subject not found"));
        }
        List<SubjectEnrollment> enrollments = enrollmentRepository.findBySubjectNew(subj.get());
        List<User> students = new ArrayList<>();
        for (SubjectEnrollment e : enrollments) {
            students.add(e.getStudent());
        }
        return ResponseEntity.ok(students);
    }
}
