package com.linklytics.dto.response;

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
public class LinkResponse {
    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private String customAlias;
    private String title;
    private boolean passwordProtected;
    private LocalDateTime expirationDate;
    private boolean expired;
    private boolean active;
    private boolean archived;
    private boolean favorite;
    private long clickCount;
    private FolderResponse folder;
    private CampaignResponse campaign;
    private List<TagResponse> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
