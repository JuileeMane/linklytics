package com.linklytics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "links", indexes = {
    @Index(name = "idx_links_short_code", columnList = "shortCode", unique = true),
    @Index(name = "idx_links_user_id", columnList = "user_id"),
    @Index(name = "idx_links_folder_id", columnList = "folder_id"),
    @Index(name = "idx_links_campaign_id", columnList = "campaign_id"),
    @Index(name = "idx_links_created_at", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048)
    private String originalUrl;

    @Column(nullable = false, unique = true, length = 50)
    private String shortCode;

    @Column(length = 50)
    private String customAlias;

    @Column(length = 255)
    private String title;

    @Column(length = 255)
    private String passwordHash;

    @Column(nullable = false)
    @Builder.Default
    private boolean passwordProtected = false;

    private LocalDateTime expirationDate;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean archived = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean favorite = false;

    @Column(nullable = false)
    @Builder.Default
    private long clickCount = 0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "link_tags",
        joinColumns = @JoinColumn(name = "link_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public boolean isExpired() {
        return expirationDate != null && LocalDateTime.now().isAfter(expirationDate);
    }
}
