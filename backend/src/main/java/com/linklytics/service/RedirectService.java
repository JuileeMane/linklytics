package com.linklytics.service;

import com.linklytics.entity.ClickEvent;
import com.linklytics.entity.Link;
import com.linklytics.exception.BadRequestException;
import com.linklytics.exception.ResourceNotFoundException;
import com.linklytics.exception.UnauthorizedException;
import com.linklytics.repository.ClickEventRepository;
import com.linklytics.repository.LinkRepository;
import com.linklytics.util.UserAgentParser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedirectService {

    private final LinkRepository linkRepository;
    private final ClickEventRepository clickEventRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String resolveDestination(String shortCode, String providedPassword, HttpServletRequest request) {
        Link link = linkRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short link '" + shortCode + "' not found."));

        if (!link.isActive()) {
            throw new BadRequestException("This link is currently paused or inactive.");
        }

        if (link.isExpired()) {
            throw new BadRequestException("This short link has expired.");
        }

        if (link.isPasswordProtected()) {
            if (providedPassword == null || providedPassword.trim().isEmpty()) {
                throw new UnauthorizedException("PASSWORD_REQUIRED");
            }
            if (!passwordEncoder.matches(providedPassword, link.getPasswordHash())) {
                throw new BadRequestException("Incorrect link password.");
            }
        }

        // Increment click count synchronously so link always displays up-to-date count
        link.setClickCount(link.getClickCount() + 1);
        linkRepository.save(link);

        // Record click event details
        recordClick(link, request);

        return link.getOriginalUrl();
    }

    @Transactional(readOnly = true)
    public boolean isPasswordProtected(String shortCode) {
        Link link = linkRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short link not found."));
        return link.isPasswordProtected();
    }

    private void recordClick(Link link, HttpServletRequest request) {
        try {
            String userAgentHeader = request.getHeader("User-Agent");
            UserAgentParser.ParsedUserAgent parsedUA = UserAgentParser.parse(userAgentHeader);

            String referrerHeader = request.getHeader("Referer");
            String referrer = cleanReferrer(referrerHeader);

            // Compute privacy-safe hash from IP + User Agent
            String clientIp = getClientIp(request);
            String visitorHash = hashVisitor(clientIp, userAgentHeader);

            // Honor cloud provider geo headers if present, else honest fallback
            String country = request.getHeader("CF-IPCountry");
            if (country == null || country.isBlank()) {
                country = request.getHeader("X-Country-Code");
            }
            if (country == null || country.isBlank()) {
                country = "Local / Direct";
            }

            ClickEvent event = ClickEvent.builder()
                    .link(link)
                    .visitorHash(visitorHash)
                    .userAgent(userAgentHeader != null && userAgentHeader.length() > 500 ? userAgentHeader.substring(0, 500) : userAgentHeader)
                    .browser(parsedUA.browser())
                    .operatingSystem(parsedUA.operatingSystem())
                    .deviceType(parsedUA.deviceType())
                    .referrer(referrer)
                    .country(country)
                    .build();

            clickEventRepository.save(event);
        } catch (Exception e) {
            log.error("Failed to record click event for link {}: {}", link.getShortCode(), e.getMessage());
        }
    }

    private String cleanReferrer(String rawReferrer) {
        if (rawReferrer == null || rawReferrer.trim().isEmpty()) {
            return "Direct";
        }
        try {
            java.net.URI uri = new java.net.URI(rawReferrer);
            String host = uri.getHost();
            if (host != null) {
                host = host.toLowerCase().replaceFirst("^www\\.", "");
                if (host.contains("google")) return "Google";
                if (host.contains("twitter") || host.contains("t.co") || host.contains("x.com")) return "X / Twitter";
                if (host.contains("linkedin")) return "LinkedIn";
                if (host.contains("facebook") || host.contains("fb.com")) return "Facebook";
                if (host.contains("instagram")) return "Instagram";
                if (host.contains("youtube")) return "YouTube";
                if (host.contains("reddit")) return "Reddit";
                if (host.contains("github")) return "GitHub";
                return host;
            }
        } catch (Exception ignored) {}
        return "Other";
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
    }

    private String hashVisitor(String ip, String userAgent) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String data = (ip != null ? ip : "") + "|" + (userAgent != null ? userAgent : "");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().substring(0, 32);
        } catch (NoSuchAlgorithmException e) {
            return String.valueOf((ip + userAgent).hashCode());
        }
    }
}
