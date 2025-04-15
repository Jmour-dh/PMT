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

    public UserDetailsDto(Long id, String username, String email, String createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = LocalDateTime.parse(createdAt);
    }

    public UserDetailsDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
        this.createdProjects = user.getCreatedProjects()
                .stream()
                .map(ProjectDto::new)
                .collect(Collectors.toList());
    }
}