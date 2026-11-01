package com.linklytics.util;

import java.security.SecureRandom;

public final class Base62Encoder {

    private static final String BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = BASE62_CHARS.length();
    private static final SecureRandom RANDOM = new SecureRandom();

    private Base62Encoder() {}

    /**
     * Encodes a positive number to Base62.
     */
    public static String encode(long number) {
        if (number == 0) {
            return String.valueOf(BASE62_CHARS.charAt(0));
        }
        StringBuilder sb = new StringBuilder();
        long n = Math.abs(number);
        while (n > 0) {
            sb.append(BASE62_CHARS.charAt((int) (n % BASE)));
            n /= BASE;
        }
        return sb.reverse().toString();
    }

    /**
     * Generates a random Base62 alphanumeric string of specified length (default 7 characters).
     * 62^7 = ~3.5 trillion possible combinations, effectively collision-safe.
     */
    public static String generateRandomCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(BASE62_CHARS.charAt(RANDOM.nextInt(BASE)));
        }
        return sb.toString();
    }

    public static String generateRandomCode() {
        return generateRandomCode(7);
    }

    /**
     * Validates if a custom alias contains only valid URL-safe characters (letters, numbers, hyphens, underscores).
     */
    public static boolean isValidAlias(String alias) {
        if (alias == null || alias.trim().isEmpty()) {
            return false;
        }
        return alias.matches("^[a-zA-Z0-9_-]{3,50}$");
    }
}
