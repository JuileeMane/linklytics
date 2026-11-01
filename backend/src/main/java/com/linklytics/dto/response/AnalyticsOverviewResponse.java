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
public class AnalyticsOverviewResponse {
    private long totalLinks;
    private long activeLinks;
    private long archivedLinks;
    private long totalClicks;
    private long estimatedUniqueVisitors;
    private List<TimePointData> clickTrends;
    private List<MetricCount> deviceBreakdown;
    private List<MetricCount> browserBreakdown;
    private List<MetricCount> osBreakdown;
    private List<MetricCount> referrerBreakdown;
    private List<LinkResponse> topLinks;
    private List<ClickLogResponse> recentClicks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimePointData {
        private String date; // YYYY-MM-DD
        private long clicks;
        private long uniqueVisitors;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricCount {
        private String name;
        private long count;
        private double percentage;
    }
}
