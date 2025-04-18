package com.PMT.Backend_PMT.dto;

import com.PMT.Backend_PMT.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsDto {

    private Long id;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    private List<ProjectDto> createdProjects;
    private List<ProjectDto> memberProjects;
    private List<TaskDto> assignedTasks;

    public UserDetailsDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
        this.createdProjects = user.getCreatedProjects()
                .stream()
                .map(ProjectDto::new)
                .collect(Collectors.toList());
        this.memberProjects = user.getProjectMemberships()
                .stream()
                .map(pm -> new ProjectDto(pm.getProject()))
                .collect(Collectors.toList());
        this.assignedTasks = user.getAssignedTasks()
                .stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());
    }
}