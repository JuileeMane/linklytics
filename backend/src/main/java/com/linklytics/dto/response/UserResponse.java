package com.linklytics.dto.response;

import com.linklytics.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
    private long totalLinks;
    private long totalClicks;
}
