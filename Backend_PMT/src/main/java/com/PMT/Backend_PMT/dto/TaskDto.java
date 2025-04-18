package com.PMT.Backend_PMT.dto;

import com.PMT.Backend_PMT.entity.Task;
import com.PMT.Backend_PMT.enumeration.TaskPriority;
import com.PMT.Backend_PMT.enumeration.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
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

    public TaskDto(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.dueDate = task.getDueDate();
        this.priority = task.getPriority();
        this.status = task.getStatus();
        this.createdById = task.getCreatedBy() != null ? task.getCreatedBy().getId() : null;
        this.assigneeId = task.getAssignee() != null ? task.getAssignee().getId() : null;
        this.projectId = task.getProject() != null ? task.getProject().getId() : null;
    }
}