package com.linklytics.service;

import com.linklytics.dto.request.CreateLinkRequest;
import com.linklytics.dto.request.UpdateLinkRequest;
import com.linklytics.dto.response.LinkResponse;
import com.linklytics.entity.*;
import com.linklytics.exception.BadRequestException;
import com.linklytics.exception.ResourceNotFoundException;
import com.linklytics.repository.*;
import com.linklytics.util.Base62Encoder;
import com.linklytics.util.UrlValidatorUtil;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.Writer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LinkService {

    private final LinkRepository linkRepository;
    private final FolderRepository folderRepository;
    private final CampaignRepository campaignRepository;
    private final TagService tagService;
    private final FolderService folderService;
    private final CampaignService campaignService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Value("${app.frontend-url:https://linklytics-azure.vercel.app}")
    private String frontendUrl;

    @Transactional
    public LinkResponse createLink(User user, CreateLinkRequest request) {
        String normalizedUrl = UrlValidatorUtil.normalizeUrl(request.getOriginalUrl());
        if (!UrlValidatorUtil.isValidUrl(normalizedUrl)) {
            throw new BadRequestException("Invalid destination URL. Only valid HTTP/HTTPS URLs are supported.");
        }

        String shortCode;
        String customAlias = null;

        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            customAlias = request.getCustomAlias().trim();
            if (!Base62Encoder.isValidAlias(customAlias)) {
                throw new BadRequestException("Custom alias must be between 3 and 50 alphanumeric characters (letters, numbers, hyphens, underscores).");
            }
            if (linkRepository.existsByShortCode(customAlias)) {
                throw new BadRequestException("Custom alias '" + customAlias + "' is already in use. Please choose another.");
            }
            shortCode = customAlias;
        } else {
            shortCode = generateUniqueShortCode();
        }

        String title = request.getTitle();
        if (title == null || title.trim().isEmpty()) {
            title = extractTitleFromUrl(normalizedUrl);
        }

        Link link = Link.builder()
                .originalUrl(normalizedUrl)
                .shortCode(shortCode)
                .customAlias(customAlias)
                .title(title)
                .user(user)
                .active(true)
                .archived(false)
                .favorite(false)
                .clickCount(0L)
                .expirationDate(request.getExpirationDate())
                .build();

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            link.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
            link.setPasswordProtected(true);
        }

        if (request.getFolderId() != null) {
            Folder folder = folderRepository.findByIdAndUser(request.getFolderId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
            link.setFolder(folder);
        }

        if (request.getCampaignId() != null) {
            Campaign campaign = campaignRepository.findByIdAndUser(request.getCampaignId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
            link.setCampaign(campaign);
        }

        if (request.getTagNames() != null && !request.getTagNames().isEmpty()) {
            link.setTags(tagService.resolveTags(user, request.getTagNames()));
        }

        Link saved = linkRepository.save(link);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<LinkResponse> getLinks(User user,
                                       String search,
                                       Long folderId,
                                       Long campaignId,
                                       String status,
                                       int page,
                                       int size,
                                       String sortBy,
                                       String direction) {

        Sort sort = Sort.by(
                "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortBy != null ? sortBy : "createdAt"
        );
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Specification<Link> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user"), user));

            // Status filter
            if ("active".equalsIgnoreCase(status)) {
                predicates.add(cb.isTrue(root.get("active")));
                predicates.add(cb.isFalse(root.get("archived")));
            } else if ("archived".equalsIgnoreCase(status)) {
                predicates.add(cb.isTrue(root.get("archived")));
            } else if ("favorite".equalsIgnoreCase(status)) {
                predicates.add(cb.isTrue(root.get("favorite")));
                predicates.add(cb.isFalse(root.get("archived")));
            } else if ("expired".equalsIgnoreCase(status)) {
                predicates.add(cb.isNotNull(root.get("expirationDate")));
                predicates.add(cb.lessThan(root.get("expirationDate"), LocalDateTime.now()));
            } else {
                // By default hide archived links from main view unless specifically requesting all/archived
                if (!"all".equalsIgnoreCase(status)) {
                    predicates.add(cb.isFalse(root.get("archived")));
                }
            }

            // Search filter
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate urlMatch = cb.like(cb.lower(root.get("originalUrl")), searchPattern);
                Predicate codeMatch = cb.like(cb.lower(root.get("shortCode")), searchPattern);
                predicates.add(cb.or(titleMatch, urlMatch, codeMatch));
            }

            // Folder filter
            if (folderId != null) {
                predicates.add(cb.equal(root.get("folder").get("id"), folderId));
            }

            // Campaign filter
            if (campaignId != null) {
                predicates.add(cb.equal(root.get("campaign").get("id"), campaignId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Link> linkPage = linkRepository.findAll(spec, pageable);
        return linkPage.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public LinkResponse getLinkById(User user, Long id) {
        Link link = linkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + id));
        return mapToResponse(link);
    }

    @Transactional
    public LinkResponse updateLink(User user, Long id, UpdateLinkRequest request) {
        Link link = linkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + id));

        if (request.getOriginalUrl() != null && !request.getOriginalUrl().trim().isEmpty()) {
            String normalized = UrlValidatorUtil.normalizeUrl(request.getOriginalUrl());
            if (!UrlValidatorUtil.isValidUrl(normalized)) {
                throw new BadRequestException("Invalid destination URL format.");
            }
            link.setOriginalUrl(normalized);
        }

        if (request.getTitle() != null) {
            link.setTitle(request.getTitle().trim());
        }

        if (Boolean.TRUE.equals(request.getRemovePassword())) {
            link.setPasswordHash(null);
            link.setPasswordProtected(false);
        } else if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            link.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
            link.setPasswordProtected(true);
        }

        if (request.getExpirationDate() != null) {
            link.setExpirationDate(request.getExpirationDate());
        }

        if (request.getActive() != null) {
            link.setActive(request.getActive());
        }

        if (request.getFolderId() != null) {
            if (request.getFolderId() == 0L) {
                link.setFolder(null);
            } else {
                Folder folder = folderRepository.findByIdAndUser(request.getFolderId(), user)
                        .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
                link.setFolder(folder);
            }
        }

        if (request.getCampaignId() != null) {
            if (request.getCampaignId() == 0L) {
                link.setCampaign(null);
            } else {
                Campaign campaign = campaignRepository.findByIdAndUser(request.getCampaignId(), user)
                        .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
                link.setCampaign(campaign);
            }
        }

        if (request.getTagNames() != null) {
            link.setTags(tagService.resolveTags(user, request.getTagNames()));
        }

        return mapToResponse(linkRepository.save(link));
    }

    @Transactional
    public void deleteLink(User user, Long id) {
        Link link = linkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + id));
        linkRepository.delete(link);
    }

    @Transactional
    public LinkResponse toggleActive(User user, Long id) {
        Link link = linkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + id));
        link.setActive(!link.isActive());
        return mapToResponse(linkRepository.save(link));
    }

    @Transactional
    public LinkResponse toggleArchive(User user, Long id) {
        Link link = linkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + id));
        link.setArchived(!link.isArchived());
        return mapToResponse(linkRepository.save(link));
    }

    @Transactional
    public LinkResponse toggleFavorite(User user, Long id) {
        Link link = linkRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + id));
        link.setFavorite(!link.isFavorite());
        return mapToResponse(linkRepository.save(link));
    }

    @Transactional(readOnly = true)
    public void exportCsv(User user, Writer writer) throws IOException {
        List<Link> links = linkRepository.findAllByUserOrderByCreatedAtDesc(user);
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader("ID", "Title", "Short Code", "Short URL", "Original URL", "Clicks", "Status", "Password Protected", "Created At", "Folder", "Campaign")
                .build();

        try (CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
            for (Link link : links) {
                printer.printRecord(
                        link.getId(),
                        link.getTitle(),
                        link.getShortCode(),
                        baseUrl + "/r/" + link.getShortCode(),
                        link.getOriginalUrl(),
                        link.getClickCount(),
                        link.isActive() ? "Active" : "Inactive",
                        link.isPasswordProtected() ? "Yes" : "No",
                        link.getCreatedAt() != null ? link.getCreatedAt().format(dtf) : "",
                        link.getFolder() != null ? link.getFolder().getName() : "",
                        link.getCampaign() != null ? link.getCampaign().getName() : ""
                );
            }
        }
    }

    public String getEffectiveBaseUrl() {
        String renderExternal = System.getenv("RENDER_EXTERNAL_URL");
        String renderHost = System.getenv("RENDER_EXTERNAL_HOSTNAME");
        if (renderExternal != null && !renderExternal.isBlank()) {
            renderExternal = renderExternal.replaceAll("/+$", "");
        } else if (renderHost != null && !renderHost.isBlank()) {
            renderExternal = "https://" + renderHost.replaceAll("/+$", "");
        }

        String cleanBase = baseUrl != null ? baseUrl.trim().replaceAll("/+$", "") : "";
        if (cleanBase.isEmpty() || cleanBase.equals("https://linklytics-backend.onrender.com")
                || cleanBase.equals("http://linklytics-backend.onrender.com")) {
            if (renderExternal != null && !renderExternal.isBlank()) {
                return renderExternal;
            }
            if (frontendUrl != null && !frontendUrl.isBlank() && !frontendUrl.contains("*")) {
                return frontendUrl.trim().replaceAll("/+$", "");
            }
            return "https://linklytics-azure.vercel.app";
        }

        return cleanBase;
    }

    public LinkResponse mapToResponse(Link link) {
        if (link == null) return null;
        return LinkResponse.builder()
                .id(link.getId())
                .originalUrl(link.getOriginalUrl())
                .shortCode(link.getShortCode())
                .shortUrl(getEffectiveBaseUrl() + "/r/" + link.getShortCode())
                .customAlias(link.getCustomAlias())
                .title(link.getTitle())
                .passwordProtected(link.isPasswordProtected())
                .expirationDate(link.getExpirationDate())
                .expired(link.isExpired())
                .active(link.isActive())
                .archived(link.isArchived())
                .favorite(link.isFavorite())
                .clickCount(link.getClickCount())
                .folder(folderService.mapToResponse(link.getFolder()))
                .campaign(campaignService.mapToResponse(link.getCampaign()))
                .tags(link.getTags().stream().map(tagService::mapToResponse).toList())
                .createdAt(link.getCreatedAt())
                .updatedAt(link.getUpdatedAt())
                .build();
    }

    private String generateUniqueShortCode() {
        int attempts = 0;
        while (attempts < 10) {
            String code = Base62Encoder.generateRandomCode(7);
            if (!linkRepository.existsByShortCode(code)) {
                return code;
            }
            attempts++;
        }
        // Fallback to timestamp + random
        return Base62Encoder.encode(System.currentTimeMillis());
    }

    private String extractTitleFromUrl(String url) {
        try {
            java.net.URI uri = new java.net.URI(url);
            String host = uri.getHost();
            if (host != null) {
                return host.replaceFirst("^www\\.", "");
            }
        } catch (Exception ignored) {}
        return "Short Link";
    }
}
