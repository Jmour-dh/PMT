package com.PMT.Backend_PMT.unitTest;

import com.PMT.Backend_PMT.controller.TaskHistoryController;
import com.PMT.Backend_PMT.dto.TaskHistoryDto;
import com.PMT.Backend_PMT.service.TaskHistoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TaskHistoryControllerTest {

    private TaskHistoryService taskHistoryService;
    private TaskHistoryController taskHistoryController;

    @BeforeEach
    void setUp() {
        taskHistoryService = mock(TaskHistoryService.class);
        taskHistoryController = new TaskHistoryController(taskHistoryService);
    }

    @Test
    void testGetTaskHistory() {
        // Préparer les données
        Long taskId = 1L;
        List<TaskHistoryDto> historyDtos = List.of(
                new TaskHistoryDto("status", "TODO", "IN_PROGRESS", LocalDateTime.now(), "user1"),
                new TaskHistoryDto("priority", "LOW", "HIGH", LocalDateTime.now(), "user2")
        );

        when(taskHistoryService.getTaskHistoryDtosByTaskId(taskId)).thenReturn(historyDtos);

        ResponseEntity<List<TaskHistoryDto>> response = taskHistoryController.getTaskHistory(taskId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        assertEquals("status", response.getBody().get(0).getChangedField());
        assertEquals("priority", response.getBody().get(1).getChangedField());
    }
}