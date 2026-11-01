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
public class LinkAnalyticsResponse {
    private LinkResponse link;
    private long totalClicks;
    private long estimatedUniqueVisitors;
    private List<AnalyticsOverviewResponse.TimePointData> clickTrends;
    private List<AnalyticsOverviewResponse.MetricCount> deviceBreakdown;
    private List<AnalyticsOverviewResponse.MetricCount> browserBreakdown;
    private List<AnalyticsOverviewResponse.MetricCount> osBreakdown;
    private List<AnalyticsOverviewResponse.MetricCount> referrerBreakdown;
    private List<ClickLogResponse> recentClicks;
}
