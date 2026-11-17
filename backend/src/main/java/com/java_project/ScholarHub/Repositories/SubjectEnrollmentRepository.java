package com.java_project.ScholarHub.Repositories;

import com.java_project.ScholarHub.Models.SubjectEnrollment;
import com.java_project.ScholarHub.Models.SubjectNew;
import com.java_project.ScholarHub.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubjectEnrollmentRepository extends JpaRepository<SubjectEnrollment, UUID> {
    List<SubjectEnrollment> findBySubjectNew(SubjectNew subjectNew);
    List<SubjectEnrollment> findByStudent(User student);
    boolean existsBySubjectNewAndStudent(SubjectNew subjectNew, User student);
}
