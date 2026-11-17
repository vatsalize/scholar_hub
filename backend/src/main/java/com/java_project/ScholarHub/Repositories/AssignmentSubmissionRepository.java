package com.java_project.ScholarHub.Repositories;

import com.java_project.ScholarHub.Models.Assignment;
import com.java_project.ScholarHub.Models.AssignmentSubmission;
import com.java_project.ScholarHub.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, UUID> {
    List<AssignmentSubmission> findByAssignment(Assignment assignment);
    List<AssignmentSubmission> findByStudent(User student);
    Optional<AssignmentSubmission> findByAssignmentAndStudent(Assignment assignment, User student);
}
