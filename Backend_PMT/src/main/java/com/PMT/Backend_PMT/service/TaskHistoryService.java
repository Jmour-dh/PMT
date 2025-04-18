package com.PMT.Backend_PMT.service;

import com.PMT.Backend_PMT.dto.TaskHistoryDto;
import com.PMT.Backend_PMT.entity.Task;
import com.PMT.Backend_PMT.entity.TaskHistory;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.repository.TaskHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskHistoryService {

    private final TaskHistoryRepository taskHistoryRepository;

    public void logTaskChange(Task task, String changedField, String oldValue, String newValue, User modifiedBy) {
        TaskHistory history = TaskHistory.builder()
                .task(task)
                .changedField(changedField)
                .oldValue(oldValue)
                .newValue(newValue)
                .modifiedBy(modifiedBy)
                .modificationDate(LocalDateTime.now()) 
                .build();

        taskHistoryRepository.save(history);
    }

    public List<TaskHistoryDto> getTaskHistoryDtosByTaskId(Long taskId) {
        return taskHistoryRepository.findByTaskId(taskId).stream()
                .map(history -> new TaskHistoryDto(
                        history.getChangedField(),
                        history.getOldValue(),
                        history.getNewValue(),
                        history.getModificationDate(),
                        history.getModifiedBy().getUsername()
                ))
                .collect(Collectors.toList());
    }
}