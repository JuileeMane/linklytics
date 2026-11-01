package com.linklytics.controller;

import com.linklytics.dto.request.PasswordVerifyRequest;
import com.linklytics.exception.UnauthorizedException;
import com.linklytics.service.RedirectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/r")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Redirect Engine", description = "Public short link redirect and password challenge handler")
public class RedirectController {

    private final RedirectService redirectService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @GetMapping("/{shortCode}")
    @Operation(summary = "Redirects visitor to the original destination URL and logs analytics click")
    public void redirect(
            @PathVariable String shortCode,
            @RequestParam(required = false) String pwd,
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {

        try {
            String destination = redirectService.resolveDestination(shortCode, pwd, request);
            response.sendRedirect(destination);
        } catch (UnauthorizedException e) {
            // Link is password protected - redirect to frontend unlock page
            response.sendRedirect(frontendUrl + "/p/" + shortCode);
        }
    }

    @PostMapping("/{shortCode}/verify")
    @Operation(summary = "Verifies password for protected link and returns destination URL")
    public ResponseEntity<Map<String, String>> verifyPassword(
            @PathVariable String shortCode,
            @Valid @RequestBody PasswordVerifyRequest request,
            HttpServletRequest httpRequest) {

        String destination = redirectService.resolveDestination(shortCode, request.getPassword(), httpRequest);
        return ResponseEntity.ok(Map.of("destinationUrl", destination));
    }

    @GetMapping("/{shortCode}/info")
    @Operation(summary = "Check if short link requires a password")
    public ResponseEntity<Map<String, Object>> getLinkInfo(@PathVariable String shortCode) {
        boolean isProtected = redirectService.isPasswordProtected(shortCode);
        return ResponseEntity.ok(Map.of(
                "shortCode", shortCode,
                "passwordProtected", isProtected
        ));
    }
}
