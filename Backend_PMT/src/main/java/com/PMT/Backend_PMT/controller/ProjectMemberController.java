package com.PMT.Backend_PMT.controller;

import com.PMT.Backend_PMT.dto.InviteMemberDto;
import com.PMT.Backend_PMT.service.ProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    @PostMapping("/{projectId}/invite")
    public ResponseEntity<Void> inviteMember(
            @PathVariable Long projectId,
            @Valid @RequestBody InviteMemberDto inviteMemberDto) {
        projectMemberService.inviteMember(projectId, inviteMemberDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}