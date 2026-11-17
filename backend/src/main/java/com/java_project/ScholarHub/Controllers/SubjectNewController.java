package com.java_project.ScholarHub.Controllers;

import com.java_project.ScholarHub.DTOs.MessageResponse;
import com.java_project.ScholarHub.DTOs.SubjectRecord;
import com.java_project.ScholarHub.DTOs.SubjectResponse;
import com.java_project.ScholarHub.Services.SubjectNewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subjectNew")
public class SubjectNewController {

    private final SubjectNewService subjectNewService;

    @Autowired(required = false)
    private com.java_project.ScholarHub.Repositories.UserRepository userRepository;

    @Autowired
    public SubjectNewController(final SubjectNewService subjectNewService) {
        this.subjectNewService = subjectNewService;
    }

    private UUID resolveUserId(String userIdStr) {
        try {
            return UUID.fromString(userIdStr);
        } catch (Exception e) {
            if (userRepository != null) {
                return userRepository.findAll().stream()
                        .findFirst()
                        .map(com.java_project.ScholarHub.Models.User::getId)
                        .orElse(UUID.randomUUID());
            }
            return UUID.randomUUID();
        }
    }

    @PostMapping("/add/{userId}/{subjectName}")
    public ResponseEntity<?> addSubject(@PathVariable("userId") String userIdStr,
                                        @PathVariable("subjectName") String subjectName) {
        try {
            UUID userId = resolveUserId(userIdStr);
            UUID id = subjectNewService.addSubject(userId, subjectName);
            return ResponseEntity.ok(new MessageResponse(id.toString()));
        } catch (RuntimeException ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
        }
    }

    @DeleteMapping("/delete/{subjectId}")
    public ResponseEntity<?> deleteSubject(@PathVariable UUID subjectId) {
        try {
            subjectNewService.deleteSubject(subjectId);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
        }
        return ResponseEntity.ok(new MessageResponse("Subject deleted successfully"));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<SubjectResponse>> getAllSubjectsDefault() {
        UUID defaultUserId = null;
        if (userRepository != null) {
            defaultUserId = userRepository.findAll().stream()
                    .findFirst()
                    .map(com.java_project.ScholarHub.Models.User::getId)
                    .orElse(null);
        }
        if (defaultUserId == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(subjectNewService.getAllSubjects(defaultUserId));
    }

    @GetMapping("/getAll/{userId}")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects(@PathVariable("userId") String userIdStr) {
        UUID userId = resolveUserId(userIdStr);
        List<SubjectResponse> response = subjectNewService.getAllSubjects(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<List<SubjectRecord>> updateSubject(@RequestBody List<SubjectRecord> subjectRecordList) {
        return ResponseEntity.ok(subjectNewService.updateSubject(subjectRecordList));
    }

}