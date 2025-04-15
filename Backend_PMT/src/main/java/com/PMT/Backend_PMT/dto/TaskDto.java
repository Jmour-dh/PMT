package com.PMT.Backend_PMT.dto;

import com.PMT.Backend_PMT.enumeration.TaskPriority;
import com.PMT.Backend_PMT.enumeration.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private Long id;

    @NotBlank(message = "The task name is required.")
    private String title;

    @NotBlank(message = "The task description is required.")
    private String description;

    @NotNull(message = "The duedate is required.")
    private LocalDateTime dueDate;

    @NotNull(message = "The priority is required.")
    private TaskPriority priority;

    private TaskStatus status;

    private Long createdById;
    private Long assigneeId;
    private Long projectId;
}