package com.linklytics.service;

import com.linklytics.dto.request.CreateLinkRequest;
import com.linklytics.dto.response.LinkResponse;
import com.linklytics.entity.Link;
import com.linklytics.entity.User;
import com.linklytics.exception.BadRequestException;
import com.linklytics.repository.CampaignRepository;
import com.linklytics.repository.FolderRepository;
import com.linklytics.repository.LinkRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LinkServiceTest {

    @Mock
    private LinkRepository linkRepository;

    @Mock
    private FolderRepository folderRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private TagService tagService;

    @Mock
    private FolderService folderService;

    @Mock
    private CampaignService campaignService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private LinkService linkService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(linkService, "baseUrl", "http://localhost:8080");

        sampleUser = User.builder()
                .id(1L)
                .name("Alex")
                .email("alex@example.com")
                .build();
    }

    @Test
    @DisplayName("Should successfully create a shortened link with generated shortCode")
    void testCreateLinkSuccess() {
        CreateLinkRequest request = CreateLinkRequest.builder()
                .originalUrl("https://example.com/long-page-path")
                .title("Example Page")
                .build();

        Link savedLink = Link.builder()
                .id(10L)
                .originalUrl("https://example.com/long-page-path")
                .shortCode("aB3k9Zx")
                .title("Example Page")
                .user(sampleUser)
                .active(true)
                .clickCount(0L)
                .tags(Collections.emptySet())
                .build();

        when(linkRepository.existsByShortCode(any())).thenReturn(false);
        when(linkRepository.save(any(Link.class))).thenReturn(savedLink);

        LinkResponse response = linkService.createLink(sampleUser, request);

        assertNotNull(response);
        assertEquals("https://example.com/long-page-path", response.getOriginalUrl());
        assertEquals("http://localhost:8080/r/aB3k9Zx", response.getShortUrl());
        verify(linkRepository, times(1)).save(any(Link.class));
    }

    @Test
    @DisplayName("Should reject link creation if custom alias is already taken")
    void testCreateLinkDuplicateAlias() {
        CreateLinkRequest request = CreateLinkRequest.builder()
                .originalUrl("https://example.com")
                .customAlias("taken-alias")
                .build();

        when(linkRepository.existsByShortCode("taken-alias")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> linkService.createLink(sampleUser, request));
        verify(linkRepository, never()).save(any(Link.class));
    }

    @Test
    @DisplayName("Should reject invalid or non-HTTP/HTTPS URLs")
    void testCreateLinkInvalidUrl() {
        CreateLinkRequest request = CreateLinkRequest.builder()
                .originalUrl("javascript:alert(1)")
                .build();

        assertThrows(BadRequestException.class, () -> linkService.createLink(sampleUser, request));
    }

    @Test
    @DisplayName("Should toggle active state of a link")
    void testToggleActive() {
        Link link = Link.builder()
                .id(5L)
                .originalUrl("https://example.com")
                .shortCode("toggle1")
                .user(sampleUser)
                .active(true)
                .tags(Collections.emptySet())
                .build();

        when(linkRepository.findByIdAndUser(5L, sampleUser)).thenReturn(Optional.of(link));
        when(linkRepository.save(any(Link.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LinkResponse response = linkService.toggleActive(sampleUser, 5L);

        assertFalse(response.isActive());
    }
}
