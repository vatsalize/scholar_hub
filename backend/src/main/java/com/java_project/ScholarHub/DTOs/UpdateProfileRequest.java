package com.java_project.ScholarHub.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class UpdateProfileRequest {

    private UUID id;
    private String name;
    private String oldPassword;
    private String newPassword;

}
