package com.linklytics.service;

import com.linklytics.dto.request.CreateFolderRequest;
import com.linklytics.dto.response.FolderResponse;
import com.linklytics.entity.Folder;
import com.linklytics.entity.User;
import com.linklytics.exception.BadRequestException;
import com.linklytics.exception.ResourceNotFoundException;
import com.linklytics.repository.FolderRepository;
import com.linklytics.repository.LinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;
    private final LinkRepository linkRepository;

    @Transactional(readOnly = true)
    public List<FolderResponse> getFolders(User user) {
        return folderRepository.findByUserOrderByNameAsc(user).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public FolderResponse createFolder(User user, CreateFolderRequest request) {
        String name = request.getName().trim();
        if (folderRepository.existsByNameAndUser(name, user)) {
            throw new BadRequestException("A folder with this name already exists.");
        }

        Folder folder = Folder.builder()
                .name(name)
                .color(request.getColor() != null && !request.getColor().isBlank() ? request.getColor() : "#6366F1")
                .user(user)
                .build();

        return mapToResponse(folderRepository.save(folder));
    }

    @Transactional
    public FolderResponse updateFolder(User user, Long id, CreateFolderRequest request) {
        Folder folder = folderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));

        String name = request.getName().trim();
        if (!folder.getName().equalsIgnoreCase(name) && folderRepository.existsByNameAndUser(name, user)) {
            throw new BadRequestException("A folder with this name already exists.");
        }

        folder.setName(name);
        if (request.getColor() != null && !request.getColor().isBlank()) {
            folder.setColor(request.getColor());
        }

        return mapToResponse(folderRepository.save(folder));
    }

    @Transactional
    public void deleteFolder(User user, Long id) {
        Folder folder = folderRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));

        // Unlink any links assigned to this folder
        linkRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .filter(l -> folder.equals(l.getFolder()))
                .forEach(l -> l.setFolder(null));

        folderRepository.delete(folder);
    }

    public FolderResponse mapToResponse(Folder folder) {
        if (folder == null) return null;
        long linkCount = linkRepository.countByFolder(folder);
        return FolderResponse.builder()
                .id(folder.getId())
                .name(folder.getName())
                .color(folder.getColor())
                .linkCount(linkCount)
                .createdAt(folder.getCreatedAt())
                .build();
    }
}
