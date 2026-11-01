package com.linklytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long activeUsers;
    private long suspendedUsers;
    private long totalLinks;
    private long activeLinks;
    private long inactiveLinks;
    private long totalClicks;
    private long estimatedUniqueVisitors;
    private List<LinkResponse> topPerformingLinks;
    private List<ClickLogResponse> recentSystemClicks;
}
