package com.PMT.Backend_PMT.controller;

import com.PMT.Backend_PMT.dto.ProjectDto;
import com.PMT.Backend_PMT.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/")
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto projectDTO) {
        ProjectDto createdProject = projectService.createProject(projectDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDto projectDTO) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}