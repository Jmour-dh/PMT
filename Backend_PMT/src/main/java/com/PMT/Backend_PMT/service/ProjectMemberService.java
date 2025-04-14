package com.PMT.Backend_PMT.service;

import com.PMT.Backend_PMT.dto.InviteMemberDto;
import com.PMT.Backend_PMT.entity.Project;
import com.PMT.Backend_PMT.entity.ProjectMember;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.enumeration.Role;
import com.PMT.Backend_PMT.exception.ResourceNotFoundException;
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
        // Vérifier si le projet existe
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé avec l'ID : " + projectId));

        // Vérifier si l'utilisateur existe
        User user = userRepository.findByEmail(inviteMemberDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email : " + inviteMemberDto.getEmail()));

        // Créer un nouveau membre du projet
        ProjectMember projectMember = ProjectMember.builder()
                .user(user)
                .project(project)
                .role(inviteMemberDto.getRole())
                .build();

        // Sauvegarder le membre du projet
        projectMemberRepository.save(projectMember);
    }
}