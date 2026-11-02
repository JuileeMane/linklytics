package com.linklytics.controller;

import com.linklytics.dto.request.ChangePasswordRequest;
import com.linklytics.dto.request.LoginRequest;
import com.linklytics.dto.request.RegisterRequest;
import com.linklytics.dto.request.UpdateProfileRequest;
import com.linklytics.dto.response.AuthResponse;
import com.linklytics.dto.response.UserResponse;
import com.linklytics.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, and profile management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and receive JWT bearer token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Client-side logout acknowledgement")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Retrieve currently authenticated user's profile and summary stats")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new com.linklytics.exception.UnauthorizedException("Authentication required");
        }
        return ResponseEntity.ok(authService.getCurrentUser(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update authenticated user's name")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        if (userDetails == null) {
            throw new com.linklytics.exception.UnauthorizedException("Authentication required");
        }
        return ResponseEntity.ok(authService.updateProfile(userDetails.getUsername(), request));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change authenticated user's password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        if (userDetails == null) {
            throw new com.linklytics.exception.UnauthorizedException("Authentication required");
        }
        authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
