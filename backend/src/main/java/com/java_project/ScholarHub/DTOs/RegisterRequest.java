package com.java_project.ScholarHub.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {

    @NotBlank(message = "Name is required.")
    private String name;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters long.")
    private String password;

    private String role;
    private String department;
    private String university;
    private String studentId;
    private String employeeId;
    private String semester;
    private String designation;
    private String officeRoom;
    private String officeHours;
    private String avatar;
    private String bio;

}
