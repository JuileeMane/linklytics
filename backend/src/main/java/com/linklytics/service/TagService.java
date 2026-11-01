package com.linklytics.service;

import com.linklytics.dto.request.CreateTagRequest;
import com.linklytics.dto.response.TagResponse;
import com.linklytics.entity.Tag;
import com.linklytics.entity.User;
import com.linklytics.exception.BadRequestException;
import com.linklytics.exception.ResourceNotFoundException;
import com.linklytics.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    private static final String[] PALETTE = {
            "#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#06B6D4", "#6366F1"
    };

    @Transactional(readOnly = true)
    public List<TagResponse> getTags(User user) {
        return tagRepository.findByUserOrderByNameAsc(user).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public TagResponse createTag(User user, CreateTagRequest request) {
        String name = request.getName().trim().toLowerCase();
        if (tagRepository.findByNameAndUser(name, user).isPresent()) {
            throw new BadRequestException("A tag with this name already exists.");
        }

        Tag tag = Tag.builder()
                .name(name)
                .color(request.getColor() != null && !request.getColor().isBlank() ? request.getColor() : PALETTE[new Random().nextInt(PALETTE.length)])
                .user(user)
                .build();

        return mapToResponse(tagRepository.save(tag));
    }

    @Transactional
    public void deleteTag(User user, Long id) {
        Tag tag = tagRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
        tagRepository.delete(tag);
    }

    @Transactional
    public Set<Tag> resolveTags(User user, List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return new HashSet<>();
        }

        Set<Tag> resolved = new HashSet<>();
        for (String raw : tagNames) {
            if (raw == null || raw.trim().isEmpty()) continue;
            String clean = raw.trim().toLowerCase();
            Tag tag = tagRepository.findByNameAndUser(clean, user)
                    .orElseGet(() -> tagRepository.save(Tag.builder()
                            .name(clean)
                            .color(PALETTE[Math.abs(clean.hashCode()) % PALETTE.length])
                            .user(user)
                            .build()));
            resolved.add(tag);
        }
        return resolved;
    }

    public TagResponse mapToResponse(Tag tag) {
        if (tag == null) return null;
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .color(tag.getColor())
                .createdAt(tag.getCreatedAt())
                .build();
    }
}
