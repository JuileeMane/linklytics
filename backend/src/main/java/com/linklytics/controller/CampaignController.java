package com.linklytics.controller;

import com.linklytics.dto.request.CreateCampaignRequest;
import com.linklytics.dto.response.CampaignResponse;
import com.linklytics.security.CustomUserDetails;
import com.linklytics.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaigns", description = "Endpoints for grouping links into marketing campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    @Operation(summary = "List all campaigns for current user")
    public ResponseEntity<List<CampaignResponse>> getCampaigns(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(campaignService.getCampaigns(userDetails.getUser()));
    }

    @PostMapping
    @Operation(summary = "Create a new campaign")
    public ResponseEntity<CampaignResponse> createCampaign(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateCampaignRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(campaignService.createCampaign(userDetails.getUser(), request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update campaign")
    public ResponseEntity<CampaignResponse> updateCampaign(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody CreateCampaignRequest request) {
        return ResponseEntity.ok(campaignService.updateCampaign(userDetails.getUser(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete campaign")
    public ResponseEntity<Map<String, String>> deleteCampaign(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        campaignService.deleteCampaign(userDetails.getUser(), id);
        return ResponseEntity.ok(Map.of("message", "Campaign deleted successfully"));
    }
}
