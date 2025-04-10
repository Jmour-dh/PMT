package com.PMT.Backend_PMT.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "project_members")
public class ProjectMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
