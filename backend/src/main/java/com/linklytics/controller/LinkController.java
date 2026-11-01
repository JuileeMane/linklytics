package com.linklytics.controller;

import com.linklytics.dto.request.CreateLinkRequest;
import com.linklytics.dto.request.UpdateLinkRequest;
import com.linklytics.dto.response.LinkResponse;
import com.linklytics.entity.User;
import com.linklytics.security.CustomUserDetails;
import com.linklytics.service.LinkService;
import com.linklytics.service.QrCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
@Tag(name = "Links", description = "Endpoints for creating, managing, searching, and exporting short links")
public class LinkController {

    private final LinkService linkService;
    private final QrCodeService qrCodeService;

    @PostMapping
    @Operation(summary = "Create a new shortened link with optional alias, password, folder, tags, or expiry")
    public ResponseEntity<LinkResponse> createLink(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateLinkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(linkService.createLink(userDetails.getUser(), request));
    }

    @GetMapping
    @Operation(summary = "Get paginated, filtered, and sorted links belonging to the user")
    public ResponseEntity<Page<LinkResponse>> getLinks(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long folderId,
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String direction) {

        return ResponseEntity.ok(linkService.getLinks(
                userDetails.getUser(), search, folderId, campaignId, status, page, size, sortBy, direction
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get link details by ID")
    public ResponseEntity<LinkResponse> getLinkById(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(linkService.getLinkById(userDetails.getUser(), id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing link")
    public ResponseEntity<LinkResponse> updateLink(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateLinkRequest request) {
        return ResponseEntity.ok(linkService.updateLink(userDetails.getUser(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a link permanently")
    public ResponseEntity<Map<String, String>> deleteLink(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        linkService.deleteLink(userDetails.getUser(), id);
        return ResponseEntity.ok(Map.of("message", "Link deleted successfully"));
    }

    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Toggle link active / paused state")
    public ResponseEntity<LinkResponse> toggleActive(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(linkService.toggleActive(userDetails.getUser(), id));
    }

    @PatchMapping("/{id}/archive")
    @Operation(summary = "Archive or restore a link")
    public ResponseEntity<LinkResponse> toggleArchive(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(linkService.toggleArchive(userDetails.getUser(), id));
    }

    @PatchMapping("/{id}/favorite")
    @Operation(summary = "Toggle favorite star on a link")
    public ResponseEntity<LinkResponse> toggleFavorite(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(linkService.toggleFavorite(userDetails.getUser(), id));
    }

    @GetMapping("/{id}/qr")
    @Operation(summary = "Generate a QR code for this link (PNG byte stream or base64 JSON)")
    public ResponseEntity<?> getQrCode(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestParam(defaultValue = "300") int size,
            @RequestParam(defaultValue = "base64") String format) {

        LinkResponse link = linkService.getLinkById(userDetails.getUser(), id);
        if ("png".equalsIgnoreCase(format)) {
            byte[] imageBytes = qrCodeService.generateQrCodeImage(link.getShortUrl(), size, size);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"qr-" + link.getShortCode() + ".png\"")
                    .contentType(MediaType.IMAGE_PNG)
                    .body(imageBytes);
        } else {
            String base64 = qrCodeService.generateQrCodeBase64(link.getShortUrl(), size, size);
            return ResponseEntity.ok(Map.of("qrBase64", base64, "shortUrl", link.getShortUrl()));
        }
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export all user's links and performance metrics as a CSV file")
    public void exportCsv(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"linklytics-links.csv\"");
        linkService.exportCsv(userDetails.getUser(), response.getWriter());
    }
}
