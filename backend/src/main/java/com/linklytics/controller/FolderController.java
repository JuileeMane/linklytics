package com.linklytics.controller;

import com.linklytics.dto.request.CreateFolderRequest;
import com.linklytics.dto.response.FolderResponse;
import com.linklytics.security.CustomUserDetails;
import com.linklytics.service.FolderService;
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
@RequestMapping("/api/folders")
@RequiredArgsConstructor
@Tag(name = "Folders", description = "Endpoints for managing link folders and organization")
public class FolderController {

    private final FolderService folderService;

    @GetMapping
    @Operation(summary = "List all folders for current user")
    public ResponseEntity<List<FolderResponse>> getFolders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(folderService.getFolders(userDetails.getUser()));
    }

    @PostMapping
    @Operation(summary = "Create a new folder")
    public ResponseEntity<FolderResponse> createFolder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateFolderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(folderService.createFolder(userDetails.getUser(), request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update folder details")
    public ResponseEntity<FolderResponse> updateFolder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody CreateFolderRequest request) {
        return ResponseEntity.ok(folderService.updateFolder(userDetails.getUser(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete folder")
    public ResponseEntity<Map<String, String>> deleteFolder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        folderService.deleteFolder(userDetails.getUser(), id);
        return ResponseEntity.ok(Map.of("message", "Folder deleted successfully"));
    }
}
