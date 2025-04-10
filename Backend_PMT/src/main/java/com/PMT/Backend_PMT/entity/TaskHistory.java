package com.PMT.Backend_PMT.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "task_history")
public class TaskHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String changeDescription;
}
