package com.linklytics.service;

import com.linklytics.dto.response.AnalyticsOverviewResponse;
import com.linklytics.dto.response.ClickLogResponse;
import com.linklytics.dto.response.LinkAnalyticsResponse;
import com.linklytics.dto.response.LinkResponse;
import com.linklytics.entity.ClickEvent;
import com.linklytics.entity.Link;
import com.linklytics.entity.User;
import com.linklytics.exception.ResourceNotFoundException;
import com.linklytics.repository.ClickEventRepository;
import com.linklytics.repository.LinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final LinkRepository linkRepository;
    private final ClickEventRepository clickEventRepository;
    private final LinkService linkService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Transactional(readOnly = true)
    public AnalyticsOverviewResponse getOverview(User user) {
        long totalLinks = linkRepository.countByUser(user);
        long activeLinks = linkRepository.countByUserAndActiveTrueAndArchivedFalse(user);
        long archivedLinks = linkRepository.countByUserAndArchivedTrue(user);
        long totalClicks = linkRepository.sumClicksByUser(user);
        long uniqueVisitors = clickEventRepository.countDistinctVisitorsByUser(user);

        // Click trends for the past 30 days
        LocalDateTime thirtyDaysAgo = LocalDate.now().minusDays(29).atStartOfDay();
        List<ClickEvent> clickEvents = clickEventRepository.findClicksByUserSince(user, thirtyDaysAgo);
        List<AnalyticsOverviewResponse.TimePointData> trends = buildClickTrends(clickEvents, 30);

        // Breakdowns
        List<AnalyticsOverviewResponse.MetricCount> devices = buildMetricCounts(clickEventRepository.countByDeviceForUser(user), totalClicks);
        List<AnalyticsOverviewResponse.MetricCount> browsers = buildMetricCounts(clickEventRepository.countByBrowserForUser(user), totalClicks);
        List<AnalyticsOverviewResponse.MetricCount> os = buildMetricCounts(clickEventRepository.countByOsForUser(user), totalClicks);
        List<AnalyticsOverviewResponse.MetricCount> referrers = buildMetricCounts(clickEventRepository.countByReferrerForUser(user), totalClicks);

        // Top 5 links
        List<LinkResponse> topLinks = linkRepository.findTop5ByUserOrderByClickCountDesc(user).stream()
                .map(linkService::mapToResponse)
                .toList();

        // Recent 15 clicks
        List<ClickLogResponse> recentClicks = clickEventRepository.findRecentClicksByUser(user, PageRequest.of(0, 15)).stream()
                .map(this::mapToClickLog)
                .toList();

        return AnalyticsOverviewResponse.builder()
                .totalLinks(totalLinks)
                .activeLinks(activeLinks)
                .archivedLinks(archivedLinks)
                .totalClicks(totalClicks)
                .estimatedUniqueVisitors(uniqueVisitors)
                .clickTrends(trends)
                .deviceBreakdown(devices)
                .browserBreakdown(browsers)
                .osBreakdown(os)
                .referrerBreakdown(referrers)
                .topLinks(topLinks)
                .recentClicks(recentClicks)
                .build();
    }

    @Transactional(readOnly = true)
    public LinkAnalyticsResponse getLinkAnalytics(User user, Long linkId) {
        Link link = linkRepository.findByIdAndUser(linkId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + linkId));

        long totalClicks = link.getClickCount();
        long uniqueVisitors = clickEventRepository.countDistinctVisitorsByLink(link);

        LocalDateTime thirtyDaysAgo = LocalDate.now().minusDays(29).atStartOfDay();
        List<ClickEvent> clickEvents = clickEventRepository.findClicksByLinkSince(link, thirtyDaysAgo);
        List<AnalyticsOverviewResponse.TimePointData> trends = buildClickTrends(clickEvents, 30);

        List<AnalyticsOverviewResponse.MetricCount> devices = buildMetricCounts(clickEventRepository.countByDeviceForLink(link), totalClicks);
        List<AnalyticsOverviewResponse.MetricCount> browsers = buildMetricCounts(clickEventRepository.countByBrowserForLink(link), totalClicks);
        List<AnalyticsOverviewResponse.MetricCount> os = buildMetricCounts(clickEventRepository.countByOsForLink(link), totalClicks);
        List<AnalyticsOverviewResponse.MetricCount> referrers = buildMetricCounts(clickEventRepository.countByReferrerForLink(link), totalClicks);

        List<ClickLogResponse> recentClicks = clickEventRepository.findAllByLinkOrderByClickedAtDesc(link, PageRequest.of(0, 20)).stream()
                .map(this::mapToClickLog)
                .toList();

        return LinkAnalyticsResponse.builder()
                .link(linkService.mapToResponse(link))
                .totalClicks(totalClicks)
                .estimatedUniqueVisitors(uniqueVisitors)
                .clickTrends(trends)
                .deviceBreakdown(devices)
                .browserBreakdown(browsers)
                .osBreakdown(os)
                .referrerBreakdown(referrers)
                .recentClicks(recentClicks)
                .build();
    }

    private List<AnalyticsOverviewResponse.TimePointData> buildClickTrends(List<ClickEvent> events, int days) {
        Map<String, Long> clicksMap = new LinkedHashMap<>();
        Map<String, Set<String>> visitorMap = new LinkedHashMap<>();

        LocalDate start = LocalDate.now().minusDays(days - 1);
        for (int i = 0; i < days; i++) {
            String key = start.plusDays(i).format(DATE_FORMATTER);
            clicksMap.put(key, 0L);
            visitorMap.put(key, new HashSet<>());
        }

        for (ClickEvent event : events) {
            if (event.getClickedAt() != null) {
                String key = event.getClickedAt().toLocalDate().format(DATE_FORMATTER);
                if (clicksMap.containsKey(key)) {
                    clicksMap.put(key, clicksMap.get(key) + 1);
                    if (event.getVisitorHash() != null) {
                        visitorMap.get(key).add(event.getVisitorHash());
                    }
                }
            }
        }

        List<AnalyticsOverviewResponse.TimePointData> result = new ArrayList<>();
        for (String key : clicksMap.keySet()) {
            result.add(AnalyticsOverviewResponse.TimePointData.builder()
                    .date(key)
                    .clicks(clicksMap.get(key))
                    .uniqueVisitors(visitorMap.get(key).size())
                    .build());
        }
        return result;
    }

    private List<AnalyticsOverviewResponse.MetricCount> buildMetricCounts(List<Object[]> rawCounts, long totalClicks) {
        List<AnalyticsOverviewResponse.MetricCount> result = new ArrayList<>();
        for (Object[] row : rawCounts) {
            String name = (String) row[0];
            Long count = (Long) row[1];
            double pct = totalClicks > 0 ? Math.round(((double) count / totalClicks * 100.0) * 10.0) / 10.0 : 0.0;

            result.add(AnalyticsOverviewResponse.MetricCount.builder()
                    .name(name != null && !name.isBlank() ? name : "Unknown")
                    .count(count)
                    .percentage(pct)
                    .build());
        }
        return result;
    }

    private ClickLogResponse mapToClickLog(ClickEvent event) {
        return ClickLogResponse.builder()
                .id(event.getId())
                .clickedAt(event.getClickedAt())
                .browser(event.getBrowser())
                .operatingSystem(event.getOperatingSystem())
                .deviceType(event.getDeviceType())
                .referrer(event.getReferrer())
                .country(event.getCountry())
                .shortCode(event.getLink() != null ? event.getLink().getShortCode() : "")
                .linkTitle(event.getLink() != null ? event.getLink().getTitle() : "")
                .build();
    }
}
