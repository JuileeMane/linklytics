package com.linklytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Tag(name = "Health Check", description = "System and database health monitoring")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping
    @Operation(summary = "Check backend and database health status")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "LinkLytics Backend");
        health.put("version", "1.0.5");
        health.put("timestamp", LocalDateTime.now());

        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            health.put("database", "CONNECTED");
        } catch (Exception e) {
            health.put("database", "DISCONNECTED: " + e.getMessage());
            return ResponseEntity.status(503).body(health);
        }

        return ResponseEntity.ok(health);
    }

    @GetMapping("/diagnostics")
    @Operation(summary = "Database diagnostics inspection")
    public ResponseEntity<Map<String, Object>> diagnostics() {
        Map<String, Object> diag = new HashMap<>();
        try {
            List<Map<String, Object>> tables = jdbcTemplate.queryForList(
                "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
            );
            diag.put("tables", tables);
        } catch (Exception e) {
            diag.put("tablesError", e.getMessage());
        }
        try {
            Integer userCount = jdbcTemplate.queryForObject("SELECT count(*) FROM users", Integer.class);
            diag.put("userCount", userCount);
        } catch (Exception e) {
            diag.put("userCountError", e.getMessage());
        }
        return ResponseEntity.ok(diag);
    }
}
