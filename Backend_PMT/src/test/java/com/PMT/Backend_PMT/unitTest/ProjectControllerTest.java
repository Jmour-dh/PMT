package com.PMT.Backend_PMT.unitTest;

import com.PMT.Backend_PMT.controller.ProjectController;
import com.PMT.Backend_PMT.dto.ProjectDto;
import com.PMT.Backend_PMT.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ProjectControllerTest {

    private ProjectService projectService;
    private ProjectController projectController;

    @BeforeEach
    void setUp() {
        projectService = mock(ProjectService.class);
        projectController = new ProjectController(projectService);
    }

    @Test
    void testCreateProject() {
        ProjectDto projectDto = new ProjectDto(null, "Test Project", "Description", LocalDate.now(), 1L, null, null);
        ProjectDto createdProject = new ProjectDto(1L, "Test Project", "Description", LocalDate.now(), 1L, null, null);

        when(projectService.createProject(projectDto)).thenReturn(createdProject);

        ResponseEntity<ProjectDto> response = projectController.createProject(projectDto);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(createdProject.getId(), response.getBody().getId());
        assertEquals(createdProject.getName(), response.getBody().getName());
    }

    @Test
    void testGetAllProjects() {
        List<ProjectDto> projects = List.of(
                new ProjectDto(1L, "Project 1", "Description 1", LocalDate.now(), 1L, null, null),
                new ProjectDto(2L, "Project 2", "Description 2", LocalDate.now(), 2L, null, null)
        );

        when(projectService.getAllProjects()).thenReturn(projects);

        ResponseEntity<List<ProjectDto>> response = projectController.getAllProjects();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetProjectById() {
        ProjectDto projectDto = new ProjectDto(1L, "Test Project", "Description", LocalDate.now(), 1L, null, null);

        when(projectService.getProjectById(1L)).thenReturn(projectDto);

        ResponseEntity<ProjectDto> response = projectController.getProjectById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(projectDto.getId(), response.getBody().getId());
    }

    @Test
    void testUpdateProject() {
        ProjectDto projectDto = new ProjectDto(null, "Updated Project", "Updated Description", LocalDate.now(), 1L, null, null);
        ProjectDto updatedProject = new ProjectDto(1L, "Updated Project", "Updated Description", LocalDate.now(), 1L, null, null);

        when(projectService.updateProject(1L, projectDto)).thenReturn(updatedProject);

        ResponseEntity<ProjectDto> response = projectController.updateProject(1L, projectDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(updatedProject.getName(), response.getBody().getName());
    }

    @Test
    void testDeleteProject() {
        doNothing().when(projectService).deleteProject(1L);

        ResponseEntity<Void> response = projectController.deleteProject(1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(projectService, times(1)).deleteProject(1L);
    }
}