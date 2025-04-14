package com.PMT.Backend_PMT.dto;

import com.PMT.Backend_PMT.entity.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {
    private Long id;

    @NotBlank(message = "Project name is required")
    @Size(max = 100, message = "Project name must be less than 100 characters")
    private String name;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Creator ID is required")
    private Long createdById;

    public ProjectDto(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.startDate = project.getStartDate();
        this.createdById = project.getCreatedBy().getId();
    }
}