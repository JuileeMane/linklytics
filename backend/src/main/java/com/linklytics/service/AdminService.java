package com.linklytics.service;

import com.linklytics.dto.response.AdminDashboardResponse;
import com.linklytics.dto.response.ClickLogResponse;
import com.linklytics.dto.response.LinkResponse;
import com.linklytics.dto.response.UserResponse;
import com.linklytics.entity.ClickEvent;
import com.linklytics.entity.Link;
import com.linklytics.entity.User;
import com.linklytics.exception.BadRequestException;
import com.linklytics.exception.ResourceNotFoundException;
import com.linklytics.repository.ClickEventRepository;
import com.linklytics.repository.LinkRepository;
import com.linklytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LinkRepository linkRepository;
    private final ClickEventRepository clickEventRepository;
    private final LinkService linkService;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActiveTrue();
        long suspendedUsers = userRepository.countByActiveFalse();

        long totalLinks = linkRepository.count();
        long activeLinks = linkRepository.countByActiveTrue();
        long inactiveLinks = linkRepository.countByActiveFalse();

        long totalClicks = linkRepository.sumAllClicks();
        long uniqueVisitors = clickEventRepository.countDistinctVisitorsPlatform();

        List<LinkResponse> topLinks = linkRepository.findTop10ByOrderByClickCountDesc().stream()
                .map(linkService::mapToResponse)
                .toList();

        List<ClickLogResponse> recentClicks = clickEventRepository.findTop20ByOrderByClickedAtDesc().stream()
                .map(this::mapToClickLog)
                .toList();

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .suspendedUsers(suspendedUsers)
                .totalLinks(totalLinks)
                .activeLinks(activeLinks)
                .inactiveLinks(inactiveLinks)
                .totalClicks(totalClicks)
                .estimatedUniqueVisitors(uniqueVisitors)
                .topPerformingLinks(topLinks)
                .recentSystemClicks(recentClicks)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(authService::mapToUserResponse)
                .toList();
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId, User adminUser) {
        if (adminUser.getId().equals(userId)) {
            throw new BadRequestException("You cannot deactivate your own admin account.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setActive(!user.isActive());
        return authService.mapToUserResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<LinkResponse> getSuspiciousLinks() {
        // High click volume or suspicious patterns
        return linkRepository.findAll().stream()
                .filter(l -> l.getClickCount() > 1000 || l.getOriginalUrl().contains(".xyz") || l.getOriginalUrl().contains(".top") || l.getOriginalUrl().contains("login"))
                .map(linkService::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteLinkByAdmin(Long linkId) {
        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + linkId));
        linkRepository.delete(link);
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
