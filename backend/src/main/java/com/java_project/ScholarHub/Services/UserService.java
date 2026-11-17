package com.java_project.ScholarHub.Services;

import com.java_project.ScholarHub.DTOs.RegisterRequest;
import com.java_project.ScholarHub.DTOs.UpdateProfileRequest;
import com.java_project.ScholarHub.Models.OtpVerification;
import com.java_project.ScholarHub.Models.Role;
import com.java_project.ScholarHub.Models.User;
import com.java_project.ScholarHub.Repositories.OtpVerificationRepository;
import com.java_project.ScholarHub.Repositories.UserRepository;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private OtpVerificationRepository otpRepository;

    public User userRegistration(RegisterRequest registerRequest) {
        User user = new User();
        user.setName(registerRequest.getName().trim());
        user.setEmail(registerRequest.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        if (registerRequest.getRole() != null) {
            try {
                user.setRole(Role.valueOf(registerRequest.getRole().toUpperCase().trim()));
            } catch (IllegalArgumentException e) {
                user.setRole(Role.STUDENT);
            }
        } else {
            user.setRole(Role.STUDENT);
        }

        user.setDepartment(registerRequest.getDepartment());
        user.setUniversity(registerRequest.getUniversity());
        user.setStudentId(registerRequest.getStudentId());
        user.setEmployeeId(registerRequest.getEmployeeId());
        user.setSemester(registerRequest.getSemester());
        user.setDesignation(registerRequest.getDesignation());
        user.setOfficeRoom(registerRequest.getOfficeRoom());
        user.setOfficeHours(registerRequest.getOfficeHours());
        user.setAvatar(registerRequest.getAvatar());
        user.setBio(registerRequest.getBio());

        userRepository.save(user);
        return user;
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email.trim().toLowerCase());
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public void userDeletion(String email) {
        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            userRepository.deleteById(user.getId());
        } else {
            throw new UsernameNotFoundException("Account with email: " + email + " not found");
        }
    }

    public void sendOtp(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        // Generate a new 6-digit OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        System.out.println("[ScholarHub OTP] Generated OTP for " + normalizedEmail + ": " + otp);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expirationTime = now.plusMinutes(5); // OTP valid for 5 minutes

        // Check if an OTP entry already exists for the email
        Optional<OtpVerification> existingOtp = otpRepository.findByEmail(normalizedEmail);

        OtpVerification otpEntry;
        if (existingOtp.isPresent()) {
            otpEntry = existingOtp.get();
            otpEntry.setOtp(passwordEncoder.encode(otp));
            otpEntry.setSentTime(now);
            otpEntry.setExpirationTime(expirationTime);
        } else {
            otpEntry = new OtpVerification(normalizedEmail, otp, now, expirationTime);
            otpEntry.setOtp(passwordEncoder.encode(otpEntry.getOtp()));
        }
        otpRepository.save(otpEntry);

        // Send OTP via email (with fallback)
        sendEmail(normalizedEmail, otp);
    }

    private void sendEmail(String to, String otp) {
        try {
            if (mailSender == null) {
                System.out.println("[ScholarHub] JavaMailSender not configured. OTP for " + to + ": " + otp);
                return;
            }
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Your OTP for Password Reset - ScholarHub");
            helper.setText("Your OTP is: <b>" + otp + "</b>. It is valid for 5 minutes.", true);
            helper.setFrom(new InternetAddress("noreply@scholarhub.edu", "ScholarHub"));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("[ScholarHub] Could not dispatch email via SMTP (mail server error). OTP for " + to + " is: " + otp);
        }
    }

    public void verifyOtp(String email, String otp) {
        String normalizedEmail = email.trim().toLowerCase();
        OtpVerification otpEntry = otpRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("No active OTP found for " + normalizedEmail));

        if (!passwordEncoder.matches(otp, otpEntry.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (otpEntry.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        otpRepository.delete(otpEntry);
    }

    public void resetPassword(String email, String newPass) {
        if (newPass.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);
    }

    public void updateProfile(String pass, UpdateProfileRequest updateProfileRequest) {
        User user = userRepository.findById(updateProfileRequest.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("true".equalsIgnoreCase(pass) && !passwordEncoder.matches(updateProfileRequest.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setName(updateProfileRequest.getName().trim());
        if ("true".equalsIgnoreCase(pass)) {
            user.setPassword(passwordEncoder.encode(updateProfileRequest.getNewPassword()));
        }
        userRepository.save(user);
    }

}
