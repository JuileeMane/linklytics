package com.linklytics.service;

import com.linklytics.dto.request.LoginRequest;
import com.linklytics.dto.request.RegisterRequest;
import com.linklytics.dto.response.AuthResponse;
import com.linklytics.entity.Role;
import com.linklytics.entity.User;
import com.linklytics.exception.BadRequestException;
import com.linklytics.repository.LinkRepository;
import com.linklytics.repository.UserRepository;
import com.linklytics.security.CustomUserDetails;
import com.linklytics.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private LinkRepository linkRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .passwordHash("hashedPassword")
                .role(Role.ROLE_USER)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user and generate token")
    void testRegisterSuccess() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Test User")
                .email("test@example.com")
                .password("Password123")
                .build();

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateTokenFromEmail(any(), any(), any(), any())).thenReturn("mockJwtToken");
        when(tokenProvider.getExpirationMs()).thenReturn(86400000L);
        when(linkRepository.countByUser(any())).thenReturn(0L);
        when(linkRepository.sumClicksByUser(any())).thenReturn(0L);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("test@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration when email already exists")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Duplicate")
                .email("test@example.com")
                .password("Password123")
                .build();

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully login user with valid credentials")
    void testLoginSuccess() {
        LoginRequest request = LoginRequest.builder()
                .email("test@example.com")
                .password("Password123")
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(sampleUser);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("mockJwtToken");
        when(tokenProvider.getExpirationMs()).thenReturn(86400000L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("test@example.com", response.getUser().getEmail());
    }
}
