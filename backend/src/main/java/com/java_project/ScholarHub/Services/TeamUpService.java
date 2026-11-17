package com.java_project.ScholarHub.Services;

import com.java_project.ScholarHub.DTOs.SearchResponse;
import com.java_project.ScholarHub.DTOs.TeamUpProfileRequest;
import com.java_project.ScholarHub.DTOs.TeamUpProfileResponse;
import com.java_project.ScholarHub.Models.User;
import com.java_project.ScholarHub.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TeamUpService {

    @Autowired
    private UserRepository userRepository;

    public TeamUpProfileResponse addTeamUpProfile(TeamUpProfileRequest teamUpProfileRequest) {
        User user = userRepository.findById(teamUpProfileRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        TeamUpProfileResponse teamUpProfileResponse = new TeamUpProfileResponse();
        teamUpProfileResponse.setBio(teamUpProfileRequest.getBio());
        teamUpProfileResponse.setSkills(teamUpProfileRequest.getSkills());
        System.out.println("Request: " + teamUpProfileRequest.getIsAvailable());
        teamUpProfileResponse.setIsAvailable(teamUpProfileRequest.getIsAvailable());
        System.out.println("Response: " + teamUpProfileResponse.getIsAvailable());
        user.setBio(teamUpProfileRequest.getBio());
        user.setSkills(teamUpProfileRequest.getSkills());
        user.setIsAvailable(teamUpProfileRequest.getIsAvailable());
        System.out.println("User: " + user.getIsAvailable());
        userRepository.save(user);
        return teamUpProfileResponse;
    }

    public TeamUpProfileResponse getTeamUpProfile(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Couldn't find user"));
        TeamUpProfileResponse teamUpProfileResponse = new TeamUpProfileResponse();
        teamUpProfileResponse.setBio(user.getBio());
        teamUpProfileResponse.setSkills(user.getSkills());
        teamUpProfileResponse.setIsAvailable(user.getIsAvailable());
        return teamUpProfileResponse;
    }

    public TeamUpProfileResponse updateTeamUpProfile(TeamUpProfileRequest teamUpProfileRequest) {
        User user = userRepository.findById(teamUpProfileRequest.getUserId()).
                orElseThrow(() -> new RuntimeException("Couldn't find user"));
        TeamUpProfileResponse teamUpProfileResponse = new TeamUpProfileResponse();
        teamUpProfileResponse.setBio(teamUpProfileRequest.getBio());
        teamUpProfileResponse.setSkills(teamUpProfileRequest.getSkills());
        teamUpProfileResponse.setIsAvailable(teamUpProfileRequest.getIsAvailable());
        user.setBio(teamUpProfileRequest.getBio());
        user.setSkills(teamUpProfileRequest.getSkills());
        user.setIsAvailable(teamUpProfileRequest.getIsAvailable());
        userRepository.save(user);
        return teamUpProfileResponse;
    }

    public void deleteTeamUpProfile(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Couldn't find user"));
        user.setBio(null);
        user.setSkills(null);
        user.setIsAvailable(false);
        userRepository.save(user);
    }

    public List<SearchResponse> searchUsers(String query) {
        List<User> users = userRepository.searchUsers(query);
        List<SearchResponse> matchedUsers = new ArrayList<>();
        users.forEach(user -> {
            SearchResponse matchedUser = new SearchResponse();
            matchedUser.setName(user.getName());
            matchedUser.setEmail(user.getEmail());
            matchedUser.setBio(user.getBio());
            matchedUser.setSkills(user.getSkills());
            matchedUser.setIsAvailable(user.getIsAvailable());
            matchedUsers.add(matchedUser);
        });
        return matchedUsers;
    }

}