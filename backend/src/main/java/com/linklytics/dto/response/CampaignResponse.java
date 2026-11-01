package com.linklytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignResponse {
    private Long id;
    private String name;
    private String description;
    private long totalLinks;
    private long totalClicks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
