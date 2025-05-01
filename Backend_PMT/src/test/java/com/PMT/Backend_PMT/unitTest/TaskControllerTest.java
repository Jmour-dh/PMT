package com.PMT.Backend_PMT.unitTest;

import com.PMT.Backend_PMT.controller.TaskController;
import com.PMT.Backend_PMT.dto.TaskDto;
import com.PMT.Backend_PMT.enumeration.TaskPriority;
import com.PMT.Backend_PMT.enumeration.TaskStatus;
import com.PMT.Backend_PMT.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    private TaskService taskService;
    private TaskController taskController;

    @BeforeEach
    void setUp() {
        taskService = mock(TaskService.class);
        taskController = new TaskController(taskService);
    }

    @Test
    void testCreateTask() {
        TaskDto taskDto = new TaskDto(null, "Test Task", "Description", LocalDateTime.now(), TaskPriority.HIGH, TaskStatus.TODO, 1L, 2L, 1L);
        TaskDto createdTask = new TaskDto(1L, "Test Task", "Description", LocalDateTime.now(), TaskPriority.HIGH, TaskStatus.TODO, 1L, 2L, 1L);

        when(taskService.createTask(taskDto)).thenReturn(createdTask);

        ResponseEntity<TaskDto> response = taskController.createTask(taskDto);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(createdTask.getId(), response.getBody().getId());
        assertEquals(createdTask.getTitle(), response.getBody().getTitle());
    }

    @Test
    void testGetAllTasks() {
        List<TaskDto> tasks = List.of(
                new TaskDto(1L, "Task 1", "Description 1", LocalDateTime.now(), TaskPriority.MEDIUM, TaskStatus.TODO, 1L, 2L, 1L),
                new TaskDto(2L, "Task 2", "Description 2", LocalDateTime.now(), TaskPriority.LOW, TaskStatus.IN_PROGRESS, 1L, 3L, 1L)
        );

        when(taskService.getAllTasks()).thenReturn(tasks);

        ResponseEntity<List<TaskDto>> response = taskController.getAllTasks();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetTaskById() {
        TaskDto taskDto = new TaskDto(1L, "Test Task", "Description", LocalDateTime.now(), TaskPriority.HIGH, TaskStatus.TODO, 1L, 2L, 1L);

        when(taskService.getTaskById(1L)).thenReturn(taskDto);

        ResponseEntity<TaskDto> response = taskController.getTaskById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(taskDto.getId(), response.getBody().getId());
    }

    @Test
    void testUpdateTask() {
        TaskDto taskDto = new TaskDto(null, "Updated Task", "Updated Description", LocalDateTime.now(), TaskPriority.LOW, TaskStatus.DONE, 1L, 2L, 1L);
        TaskDto updatedTask = new TaskDto(1L, "Updated Task", "Updated Description", LocalDateTime.now(), TaskPriority.LOW, TaskStatus.DONE, 1L, 2L, 1L);

        when(taskService.updateTask(1L, taskDto)).thenReturn(updatedTask);

        ResponseEntity<TaskDto> response = taskController.updateTask(1L, taskDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(updatedTask.getTitle(), response.getBody().getTitle());
    }

    @Test
    void testDeleteTask() {
        doNothing().when(taskService).deleteTask(1L, 1L);

        ResponseEntity<Void> response = taskController.deleteTask(1L, 1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(taskService, times(1)).deleteTask(1L, 1L);
    }

    @Test
    void testAssignTaskToProject() {
        TaskDto assignedTask = new TaskDto(1L, "Assigned Task", "Description", LocalDateTime.now(), TaskPriority.HIGH, TaskStatus.TODO, 1L, 2L, 1L);

        when(taskService.assignTaskToProject(1L, 1L, 2L)).thenReturn(assignedTask);

        ResponseEntity<TaskDto> response = taskController.assignTaskToProject(1L, 1L, 2L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(assignedTask.getId(), response.getBody().getId());
    }
}