package com.linklytics.util;

import java.util.Locale;

public final class UserAgentParser {

    private UserAgentParser() {}

    public static ParsedUserAgent parse(String userAgent) {
        if (userAgent == null || userAgent.trim().isEmpty()) {
            return new ParsedUserAgent("Unknown", "Unknown", "Desktop");
        }

        String ua = userAgent.toLowerCase(Locale.ROOT);

        // Detect Device Type
        String deviceType = "Desktop";
        if (ua.contains("ipad") || ua.contains("tablet") || (ua.contains("android") && !ua.contains("mobile"))) {
            deviceType = "Tablet";
        } else if (ua.contains("mobile") || ua.contains("iphone") || ua.contains("ipod") || ua.contains("android")) {
            deviceType = "Mobile";
        }

        // Detect Operating System
        String os = "Other";
        if (ua.contains("iphone") || ua.contains("ipad") || ua.contains("ipod") || ua.contains("cpu os") || ua.contains("ios")) {
            os = "iOS";
        } else if (ua.contains("windows nt 10.0") || ua.contains("windows nt 11.0") || ua.contains("windows")) {
            os = "Windows";
        } else if (ua.contains("macintosh") || ua.contains("mac os x")) {
            os = "macOS";
        } else if (ua.contains("android")) {
            os = "Android";
        } else if (ua.contains("cros")) {
            os = "Chrome OS";
        } else if (ua.contains("linux")) {
            os = "Linux";
        }

        // Detect Browser (order matters because many browsers include chrome/safari in their UA)
        String browser = "Other";
        if (ua.contains("edg/") || ua.contains("edge/")) {
            browser = "Edge";
        } else if (ua.contains("opr/") || ua.contains("opera/")) {
            browser = "Opera";
        } else if (ua.contains("samsungbrowser/")) {
            browser = "Samsung Internet";
        } else if (ua.contains("brave")) {
            browser = "Brave";
        } else if (ua.contains("firefox/") || ua.contains("fxios/")) {
            browser = "Firefox";
        } else if (ua.contains("chrome/") || ua.contains("crios/")) {
            browser = "Chrome";
        } else if (ua.contains("safari/") && !ua.contains("chrome")) {
            browser = "Safari";
        }

        return new ParsedUserAgent(browser, os, deviceType);
    }

    public record ParsedUserAgent(String browser, String operatingSystem, String deviceType) {}
}
