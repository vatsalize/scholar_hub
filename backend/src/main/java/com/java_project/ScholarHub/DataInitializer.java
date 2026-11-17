package com.java_project.ScholarHub;

import com.java_project.ScholarHub.Models.*;
import com.java_project.ScholarHub.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    public static final UUID DEMO_STUDENT_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    public static final UUID DEMO_PROFESSOR_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private SubjectNewRepository subjectNewRepository;

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private TodoTaskRepository todoTaskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMembersRepository projectMembersRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Override
    public void run(String... args) {
        initUsers();
    }

    private void initUsers() {
        // 1. Seed Demo Student
        User student;
        if (!userRepository.existsByEmail("alex.morgan@scholarhub.edu")) {
            student = new User();
            student.setName("Alex Morgan");
            student.setEmail("alex.morgan@scholarhub.edu");
            student.setPassword(passwordEncoder.encode("password123"));
            student.setRole(Role.STUDENT);
            student.setStudentId("CS-2024-0492");
            student.setDepartment("Computer Science & Engineering");
            student.setSemester("5th Semester");
            student.setUniversity("Metropolitan Institute of Technology");
            student.setBio("Junior CS Student passionate about Distributed Systems & Full-Stack Development.");
            student.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80");
            student.setIsVerified(true);
            student = userRepository.save(student);
        } else {
            student = userRepository.findByEmail("alex.morgan@scholarhub.edu").orElse(null);
        }

        // 2. Seed Demo Professor
        User professor;
        if (!userRepository.existsByEmail("dr.vance@scholarhub.edu")) {
            professor = new User();
            professor.setName("Dr. Alistair Vance");
            professor.setEmail("dr.vance@scholarhub.edu");
            professor.setPassword(passwordEncoder.encode("password123"));
            professor.setRole(Role.PROFESSOR);
            professor.setEmployeeId("FAC-CS-101");
            professor.setDesignation("Professor & Department Chair");
            professor.setDepartment("Computer Science & Engineering");
            professor.setUniversity("Metropolitan Institute of Technology");
            professor.setOfficeRoom("Faculty Block B, Room 412");
            professor.setOfficeHours("Mon & Wed: 02:00 PM - 04:30 PM");
            professor.setBio("Senior Professor of Computer Systems & Algorithms with 16 years of academic research and graduate teaching.");
            professor.setAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80");
            professor.setIsVerified(true);
            professor = userRepository.save(professor);
        } else {
            professor = userRepository.findByEmail("dr.vance@scholarhub.edu").orElse(null);
        }

        // 3. Seed Subjects for Student
        if (student != null && subjectNewRepository.findByUserId(student.getId()).isEmpty()) {
            List<String> subjectNames = List.of(
                    "Data Structures & Algorithms",
                    "Database Management Systems",
                    "Operating Systems",
                    "Computer Networks",
                    "Software Engineering"
            );

            for (String subName : subjectNames) {
                SubjectNew sub = new SubjectNew();
                sub.setName(subName);
                sub.setUser(student);
                sub = subjectNewRepository.save(sub);

                // Add 10 attendance records per subject (8 present, 2 absent)
                LocalDate now = LocalDate.now();
                for (int i = 1; i <= 10; i++) {
                    AttendanceRecord rec = new AttendanceRecord();
                    rec.setSubjectNew(sub);
                    rec.setUser(student);
                    rec.setDate(now.minusDays(i * 2L));
                    rec.setStatus(i % 5 == 0 ? "absent" : "present");
                    rec.setNote(i % 5 == 0 ? "Sick leave" : "Attended regular lecture");
                    attendanceRecordRepository.save(rec);
                }
            }
        }

        // 4. Seed Board & Todo Tasks for Student
        if (student != null && boardRepository.findByUserId(student.getId()).isEmpty()) {
            Board board = new Board();
            board.setName("Academic Tasks");
            board.setUser(student);
            board = boardRepository.save(board);

            TodoTask t1 = new TodoTask();
            t1.setTitle("Complete Graph Algorithms Assignment");
            t1.setBoard(board);
            t1.setUser(student);
            t1.setPriority("High");
            t1.setDueDate(LocalDateTime.now().plusDays(2));
            todoTaskRepository.save(t1);

            TodoTask t2 = new TodoTask();
            t2.setTitle("Submit DBMS Schema Proposal");
            t2.setBoard(board);
            t2.setUser(student);
            t2.setPriority("Medium");
            t2.setDueDate(LocalDateTime.now().plusDays(4));
            todoTaskRepository.save(t2);
        }

        // 5. Seed Project for Student
        if (student != null && projectRepository.findAll().isEmpty()) {
            Project project = new Project();
            project.setName("Autonomous Robot Navigation");
            project.setDescription("SLAM-based indoor positioning and pathfinding algorithms on ROS2.");
            project = projectRepository.save(project);

            ProjectMembers member = new ProjectMembers();
            member.setProject(project);
            member.setUser(student);
            member.setRole("leader");
            projectMembersRepository.save(member);
        }

        // 6. Seed Announcements from Professor
        if (professor != null && announcementRepository.findAll().isEmpty()) {
            Announcement a1 = new Announcement();
            a1.setProfessor(professor);
            a1.setTitle("Midterm Examination Schedule Released");
            a1.setContent("The midterm examinations will commence from next Monday. Please review syllabus modules 1 to 4.");
            a1.setPriority("HIGH");
            announcementRepository.save(a1);
        }
    }
}
