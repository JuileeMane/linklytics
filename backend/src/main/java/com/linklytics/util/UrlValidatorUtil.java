package com.linklytics.util;

import java.net.URI;
import java.net.URISyntaxException;

public final class UrlValidatorUtil {

    private UrlValidatorUtil() {}

    /**
     * Strictly validates that the URL is a valid HTTP or HTTPS destination.
     * Rejects javascript:, file:, data:, mailto:, ftp:, or malformed strings.
     */
    public static boolean isValidUrl(String url) {
        if (url == null || url.trim().isEmpty() || url.length() > 2048) {
            return false;
        }

        String trimmed = url.trim();
        try {
            URI uri = new URI(trimmed);
            String scheme = uri.getScheme();
            if (scheme == null) {
                return false;
            }
            scheme = scheme.toLowerCase();
            if (!scheme.equals("http") && !scheme.equals("https")) {
                return false;
            }
            if (uri.getHost() == null || uri.getHost().trim().isEmpty()) {
                return false;
            }
            return true;
        } catch (URISyntaxException e) {
            return false;
        }
    }

    /**
     * Sanitizes or auto-prefixes http/https if missing, returning normalized string.
     */
    public static String normalizeUrl(String url) {
        if (url == null) return null;
        String trimmed = url.trim();
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            trimmed = "https://" + trimmed;
        }
        return trimmed;
    }
}
