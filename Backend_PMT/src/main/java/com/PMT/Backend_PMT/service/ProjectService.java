package com.PMT.Backend_PMT.service;

import com.PMT.Backend_PMT.dto.ProjectDto;
import com.PMT.Backend_PMT.entity.Project;
import com.PMT.Backend_PMT.entity.ProjectMember;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.enumeration.Role;
import com.PMT.Backend_PMT.exception.ResourceNotFoundException;
import com.PMT.Backend_PMT.repository.ProjectMemberRepository;
import com.PMT.Backend_PMT.repository.ProjectRepository;
import com.PMT.Backend_PMT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Transactional
    public ProjectDto createProject(ProjectDto projectDTO) {
        User creator = userRepository.findById(projectDTO.getCreatedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + projectDTO.getCreatedById()));

        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setStartDate(projectDTO.getStartDate());
        project.setCreatedBy(creator);

        Project savedProject = projectRepository.save(project);

        ProjectMember projectMember = ProjectMember.builder()
                .user(creator)
                .project(savedProject)
                .role(Role.ADMIN)
                .build();
        projectMemberRepository.save(projectMember);

        return new ProjectDto(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(ProjectDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return new ProjectDto(project);
    }

    @Transactional
    public ProjectDto updateProject(Long id, ProjectDto projectDTO) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (projectDTO.getName() != null) {
            existingProject.setName(projectDTO.getName());
        }
        if (projectDTO.getDescription() != null) {
            existingProject.setDescription(projectDTO.getDescription());
        }
        if (projectDTO.getStartDate() != null) {
            existingProject.setStartDate(projectDTO.getStartDate());
        }
        if (projectDTO.getCreatedById() != null) {
            User creator = userRepository.findById(projectDTO.getCreatedById())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + projectDTO.getCreatedById()));
            existingProject.setCreatedBy(creator);
        }

        Project updatedProject = projectRepository.save(existingProject);
        return new ProjectDto(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.delete(project);
    }
}