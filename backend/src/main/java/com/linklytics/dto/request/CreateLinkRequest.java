package com.linklytics.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLinkRequest {

    @NotBlank(message = "Destination URL is required")
    @Size(max = 2048, message = "URL cannot exceed 2048 characters")
    private String originalUrl;

    @Size(min = 3, max = 50, message = "Custom alias must be between 3 and 50 characters")
    private String customAlias;

    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Size(max = 100, message = "Password cannot exceed 100 characters")
    private String password;

    private LocalDateTime expirationDate;

    private Long folderId;

    private Long campaignId;

    private List<String> tagNames;
}
