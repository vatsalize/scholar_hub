package com.java_project.ScholarHub.Controllers;

import com.java_project.ScholarHub.DTOs.*;
import com.java_project.ScholarHub.Models.User;
import com.java_project.ScholarHub.Services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(final UserService userService, final BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "ScholarHub API Backend is healthy and connected"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> userRegistration(@Valid @RequestBody RegisterRequest registerRequest,
                                              BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            bindingResult.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("\n"));
            return ResponseEntity.badRequest().body(Map.of("message", errors.toString().trim()));
        }

        if (userService.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already in use."));
        }

        User user = userService.userRegistration(registerRequest);
        String token = "scholarhub_jwt_" + user.getId() + "_" + System.currentTimeMillis();

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        response.put("message", "Registration successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@Valid @RequestBody LoginRequest loginRequest,
                                       BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            bindingResult.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("\n"));
            return ResponseEntity.badRequest().body(Map.of("message", errors.toString().trim()));
        }

        // Find user by email
        User user;
        try {
            user = userService.findByEmail(loginRequest.getEmail());
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
        }

        // Check if password matches
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String token = "scholarhub_jwt_" + user.getId() + "_" + System.currentTimeMillis();
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid password"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is required."));
        }
        try {
            userService.sendOtp(email);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Password reset OTP dispatched to " + email
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> userDeletion(@PathVariable String email) {
        try {
            userService.userDeletion(email);
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Account not found"));
        }
        return ResponseEntity.ok(new MessageResponse("Account deleted successfully"));
    }

    @PostMapping("/send-otp/{email}")
    public ResponseEntity<?> sendOtp(@PathVariable String email) {
        try {
            userService.sendOtp(email);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
        }
        return ResponseEntity.ok(new MessageResponse("OTP sent successfully"));
    }

    @PostMapping("/verify-otp/{email}")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest, @PathVariable String email) {
        try {
            userService.verifyOtp(email, verifyOtpRequest.getOtp());
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
        }
        return ResponseEntity.ok(new MessageResponse("OTP verified successfully"));
    }

    @PutMapping("/reset-pass/{email}")
    public ResponseEntity<?> resetPassword(@PathVariable String email, @RequestBody VerifyOtpRequest verifyOtpRequest) {
        try {
            userService.resetPassword(email, verifyOtpRequest.getOtp());
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
        }
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }

    @PutMapping("/update-profile/{pass}")
    public ResponseEntity<?> updateProfile(@PathVariable String pass, @RequestBody UpdateProfileRequest updateProfileRequest) {
        try {
            userService.updateProfile(pass, updateProfileRequest);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
        }
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
    }

}
