package com.java_project.ScholarHub.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class EditProjectRequest {

    private UUID id;
    private String name;
    private String description;

}
