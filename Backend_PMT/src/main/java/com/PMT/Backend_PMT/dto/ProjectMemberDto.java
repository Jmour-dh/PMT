package com.PMT.Backend_PMT.dto;

import com.PMT.Backend_PMT.enumeration.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectMemberDto {
    private Long userId;
    private String username;
    private Role role;
}