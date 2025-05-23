package com.PMT.Backend_PMT.service;

import com.PMT.Backend_PMT.dto.InviteMemberDto;
import com.PMT.Backend_PMT.entity.Project;
import com.PMT.Backend_PMT.entity.ProjectMember;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.enumeration.Role;
import com.PMT.Backend_PMT.exception.ResourceNotFoundException;
import com.PMT.Backend_PMT.exception.UserAlreadyMemberException;
import com.PMT.Backend_PMT.repository.ProjectMemberRepository;
import com.PMT.Backend_PMT.repository.ProjectRepository;
import com.PMT.Backend_PMT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectMemberService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public void inviteMember(Long projectId, InviteMemberDto inviteMemberDto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        User user = userRepository.findByEmail(inviteMemberDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + inviteMemberDto.getEmail()));

        boolean isAlreadyMember = projectMemberRepository.existsByUserAndProject(user, project);
        if (isAlreadyMember) {
            throw new UserAlreadyMemberException("The user is already a member of this project.");
        }

        ProjectMember projectMember = ProjectMember.builder()
                .user(user)
                .project(project)
                .role(inviteMemberDto.getRole())
                .build();

        projectMemberRepository.save(projectMember);
    }
}