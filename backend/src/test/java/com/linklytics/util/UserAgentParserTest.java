package com.linklytics.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserAgentParserTest {

    @Test
    @DisplayName("Should parse Windows Chrome Desktop user agent")
    void testWindowsChrome() {
        String ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
        UserAgentParser.ParsedUserAgent result = UserAgentParser.parse(ua);

        assertEquals("Chrome", result.browser());
        assertEquals("Windows", result.operatingSystem());
        assertEquals("Desktop", result.deviceType());
    }

    @Test
    @DisplayName("Should parse iPhone Mobile Safari user agent")
    void testIphoneSafari() {
        String ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1";
        UserAgentParser.ParsedUserAgent result = UserAgentParser.parse(ua);

        assertEquals("Safari", result.browser());
        assertEquals("iOS", result.operatingSystem());
        assertEquals("Mobile", result.deviceType());
    }

    @Test
    @DisplayName("Should parse Android Firefox Mobile user agent")
    void testAndroidFirefox() {
        String ua = "Mozilla/5.0 (Android 14; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0";
        UserAgentParser.ParsedUserAgent result = UserAgentParser.parse(ua);

        assertEquals("Firefox", result.browser());
        assertEquals("Android", result.operatingSystem());
        assertEquals("Mobile", result.deviceType());
    }

    @Test
    @DisplayName("Should gracefully handle null or empty user agents")
    void testNullUserAgent() {
        UserAgentParser.ParsedUserAgent result = UserAgentParser.parse(null);
        assertEquals("Unknown", result.browser());
        assertEquals("Unknown", result.operatingSystem());
        assertEquals("Desktop", result.deviceType());
    }
}
