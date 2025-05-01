package com.PMT.Backend_PMT.unitTest;

import com.PMT.Backend_PMT.controller.ProjectMemberController;
import com.PMT.Backend_PMT.dto.InviteMemberDto;
import com.PMT.Backend_PMT.enumeration.Role;
import com.PMT.Backend_PMT.service.ProjectMemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ProjectMemberControllerTest {

    private ProjectMemberService projectMemberService;
    private ProjectMemberController projectMemberController;

    @BeforeEach
    void setUp() {
        projectMemberService = mock(ProjectMemberService.class);
        projectMemberController = new ProjectMemberController(projectMemberService);
    }

    @Test
    void testInviteMember() {
        Long projectId = 1L;
        InviteMemberDto inviteMemberDto = new InviteMemberDto("test@example.com", Role.MEMBER);

        doNothing().when(projectMemberService).inviteMember(projectId, inviteMemberDto);

        ResponseEntity<Void> response = projectMemberController.inviteMember(projectId, inviteMemberDto);

        assertEquals(201, response.getStatusCodeValue());
        verify(projectMemberService, times(1)).inviteMember(projectId, inviteMemberDto);
    }
}