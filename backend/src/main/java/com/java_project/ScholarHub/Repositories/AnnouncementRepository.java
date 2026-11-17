package com.java_project.ScholarHub.Repositories;

import com.java_project.ScholarHub.Models.Announcement;
import com.java_project.ScholarHub.Models.SubjectNew;
import com.java_project.ScholarHub.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
    List<Announcement> findByProfessorOrderByCreatedAtDesc(User professor);
    List<Announcement> findBySubjectNewOrderByCreatedAtDesc(SubjectNew subjectNew);
    List<Announcement> findBySubjectNewOrSubjectNewIsNullOrderByCreatedAtDesc(SubjectNew subjectNew);
}
