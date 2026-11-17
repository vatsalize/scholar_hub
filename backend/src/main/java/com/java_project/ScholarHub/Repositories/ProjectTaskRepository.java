package com.java_project.ScholarHub.Repositories;

import com.java_project.ScholarHub.Models.ProjectTask;
import com.java_project.ScholarHub.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectTaskRepository extends JpaRepository<ProjectTask, UUID> {

    List<ProjectTask> findByProjectId(UUID projectId);

}
