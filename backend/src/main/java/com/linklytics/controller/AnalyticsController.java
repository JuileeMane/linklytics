package com.linklytics.controller;

import com.linklytics.dto.response.AnalyticsOverviewResponse;
import com.linklytics.dto.response.LinkAnalyticsResponse;
import com.linklytics.security.CustomUserDetails;
import com.linklytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Real-time analytics engine for clicks, devices, browsers, and referrers")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    @Operation(summary = "Get aggregated analytics overview for all links owned by current user")
    public ResponseEntity<AnalyticsOverviewResponse> getOverview(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getOverview(userDetails.getUser()));
    }

    @GetMapping("/link/{id}")
    @Operation(summary = "Get detailed analytics and breakdown charts for a specific link")
    public ResponseEntity<LinkAnalyticsResponse> getLinkAnalytics(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getLinkAnalytics(userDetails.getUser(), id));
    }
}
