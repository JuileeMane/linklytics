package com.linklytics.controller;

import com.linklytics.dto.response.AdminDashboardResponse;
import com.linklytics.dto.response.LinkResponse;
import com.linklytics.dto.response.UserResponse;
import com.linklytics.security.CustomUserDetails;
import com.linklytics.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Operations", description = "Privileged endpoints for platform administrators")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform-wide metrics, total users, links, and system activity")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/users")
    @Operation(summary = "List all registered users on the platform")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Suspend or activate a user account")
    public ResponseEntity<UserResponse> toggleUserStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id, userDetails.getUser()));
    }

    @GetMapping("/suspicious-links")
    @Operation(summary = "Retrieve links flagged for high traffic velocity or suspicious domains")
    public ResponseEntity<List<LinkResponse>> getSuspiciousLinks() {
        return ResponseEntity.ok(adminService.getSuspiciousLinks());
    }

    @DeleteMapping("/links/{id}")
    @Operation(summary = "Delete an abusive link from the platform")
    public ResponseEntity<Map<String, String>> deleteLink(@PathVariable Long id) {
        adminService.deleteLinkByAdmin(id);
        return ResponseEntity.ok(Map.of("message", "Link removed by administrator"));
    }
}
