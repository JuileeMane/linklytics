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
public class ClickLogResponse {
    private Long id;
    private LocalDateTime clickedAt;
    private String browser;
    private String operatingSystem;
    private String deviceType;
    private String referrer;
    private String country;
    private String shortCode;
    private String linkTitle;
}
