package com.linklytics.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFolderRequest {

    @NotBlank(message = "Folder name is required")
    @Size(min = 1, max = 100, message = "Folder name must be between 1 and 100 characters")
    private String name;

    @Size(max = 20, message = "Color code cannot exceed 20 characters")
    private String color;
}
