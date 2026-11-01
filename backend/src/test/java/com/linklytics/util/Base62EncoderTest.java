package com.linklytics.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class Base62EncoderTest {

    @Test
    @DisplayName("Should encode positive long numbers to Base62 representation")
    void testEncode() {
        assertEquals("0", Base62Encoder.encode(0));
        assertEquals("1", Base62Encoder.encode(1));
        assertEquals("Z", Base62Encoder.encode(61));
        assertEquals("10", Base62Encoder.encode(62));
    }

    @Test
    @DisplayName("Should generate random alphanumeric codes with specified length")
    void testGenerateRandomCode() {
        String code = Base62Encoder.generateRandomCode(7);
        assertNotNull(code);
        assertEquals(7, code.length());
        assertTrue(code.matches("^[0-9a-zA-Z]+$"));
    }

    @Test
    @DisplayName("Should validate alias characters and length")
    void testIsValidAlias() {
        assertTrue(Base62Encoder.isValidAlias("my-custom-link"));
        assertTrue(Base62Encoder.isValidAlias("spring_boot_2026"));
        assertTrue(Base62Encoder.isValidAlias("abc123XYZ"));

        assertFalse(Base62Encoder.isValidAlias("ab")); // too short (<3)
        assertFalse(Base62Encoder.isValidAlias("invalid/alias")); // slashes not allowed
        assertFalse(Base62Encoder.isValidAlias("spaces not allowed")); // spaces
        assertFalse(Base62Encoder.isValidAlias(null));
        assertFalse(Base62Encoder.isValidAlias(""));
    }
}
