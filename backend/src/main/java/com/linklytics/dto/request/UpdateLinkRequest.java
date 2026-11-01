package com.linklytics.dto.request;

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
public class UpdateLinkRequest {

    @Size(max = 2048, message = "URL cannot exceed 2048 characters")
    private String originalUrl;

    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private String password;

    private Boolean removePassword;

    private LocalDateTime expirationDate;

    private Long folderId;

    private Long campaignId;

    private List<String> tagNames;

    private Boolean active;
}
