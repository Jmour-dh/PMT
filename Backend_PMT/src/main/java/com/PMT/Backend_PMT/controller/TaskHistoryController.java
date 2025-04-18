package com.PMT.Backend_PMT.controller;

import com.PMT.Backend_PMT.dto.TaskHistoryDto;
import com.PMT.Backend_PMT.service.TaskHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-history")
@RequiredArgsConstructor
public class TaskHistoryController {

    private final TaskHistoryService taskHistoryService;

    @GetMapping("/{taskId}")
    public ResponseEntity<List<TaskHistoryDto>> getTaskHistory(@PathVariable Long taskId) {
        List<TaskHistoryDto> historyDtos = taskHistoryService.getTaskHistoryDtosByTaskId(taskId);
        return ResponseEntity.ok(historyDtos);
    }
}