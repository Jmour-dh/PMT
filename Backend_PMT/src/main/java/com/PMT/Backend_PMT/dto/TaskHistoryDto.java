package com.PMT.Backend_PMT.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TaskHistoryDto {
    private String changedField;
    private String oldValue;
    private String newValue;
    private LocalDateTime modificationDate;
    private String modifiedByUsername;
}