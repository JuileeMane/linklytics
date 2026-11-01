package com.linklytics.controller;

import com.linklytics.dto.request.CreateTagRequest;
import com.linklytics.dto.response.TagResponse;
import com.linklytics.security.CustomUserDetails;
import com.linklytics.service.TagService;
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
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Tag(name = "Tags", description = "Endpoints for managing link tags")
public class TagController {

    private final TagService tagService;

    @GetMapping
    @Operation(summary = "List all tags created by current user")
    public ResponseEntity<List<TagResponse>> getTags(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(tagService.getTags(userDetails.getUser()));
    }

    @PostMapping
    @Operation(summary = "Create a custom tag")
    public ResponseEntity<TagResponse> createTag(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateTagRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tagService.createTag(userDetails.getUser(), request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tag")
    public ResponseEntity<Map<String, String>> deleteTag(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        tagService.deleteTag(userDetails.getUser(), id);
        return ResponseEntity.ok(Map.of("message", "Tag deleted successfully"));
    }
}
