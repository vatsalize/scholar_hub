package com.java_project.ScholarHub.Repositories;

import com.java_project.ScholarHub.Models.Assignment;
import com.java_project.ScholarHub.Models.SubjectNew;
import com.java_project.ScholarHub.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    List<Assignment> findByProfessor(User professor);
    List<Assignment> findBySubjectNew(SubjectNew subjectNew);
    List<Assignment> findBySubjectNewAndIsDraftFalse(SubjectNew subjectNew);
}
