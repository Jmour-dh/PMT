package com.PMT.Backend_PMT.service;

import com.PMT.Backend_PMT.dto.TaskDto;
import com.PMT.Backend_PMT.entity.Task;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.entity.Project;
import com.PMT.Backend_PMT.enumeration.Role;
import com.PMT.Backend_PMT.enumeration.TaskStatus;
import com.PMT.Backend_PMT.exception.ResourceNotFoundException;
import com.PMT.Backend_PMT.repository.TaskRepository;
import com.PMT.Backend_PMT.repository.UserRepository;
import com.PMT.Backend_PMT.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final EmailService emailService;

    @Transactional
    public TaskDto createTask(TaskDto taskDto) {
        User createdBy = userRepository.findById(taskDto.getCreatedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + taskDto.getCreatedById()));

        Project project = projectRepository.findById(taskDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + taskDto.getProjectId()));

        validateUserPermission(createdBy, project);

        final User assignee;
        if (taskDto.getAssigneeId() != null) {
            assignee = userRepository.findById(taskDto.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + taskDto.getAssigneeId()));

            validateAssigneeIsProjectMember(assignee, project);
        } else {
            assignee = null;
        }

        Task task = Task.builder()
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .dueDate(taskDto.getDueDate())
                .priority(taskDto.getPriority())
                .status(taskDto.getStatus() != null ? taskDto.getStatus() : TaskStatus.TODO)
                .createdBy(createdBy)
                .assignee(assignee)
                .project(project)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    @Transactional
    public TaskDto updateTask(Long id, TaskDto taskDto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));

        User currentUser = userRepository.findById(taskDto.getCreatedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + taskDto.getCreatedById()));

        validateUserPermission(currentUser, task.getProject());

        if (taskDto.getTitle() != null) task.setTitle(taskDto.getTitle());
        if (taskDto.getDescription() != null) task.setDescription(taskDto.getDescription());
        if (taskDto.getDueDate() != null) task.setDueDate(taskDto.getDueDate());
        if (taskDto.getPriority() != null) task.setPriority(taskDto.getPriority());
        if (taskDto.getStatus() != null) task.setStatus(taskDto.getStatus());

        if (taskDto.getAssigneeId() != null) {
            User assignee = userRepository.findById(taskDto.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + taskDto.getAssigneeId()));

            validateAssigneeIsProjectMember(assignee, task.getProject());
            task.setAssignee(assignee);
        }

        Task updatedTask = taskRepository.save(task);
        return mapToDto(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id, Long userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        validateUserPermission(currentUser, task.getProject());

        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));
        return mapToDto(task);
    }

    private void validateUserPermission(User user, Project project) {
        boolean hasPermission = project.getMembers().stream()
                .anyMatch(member -> member.getUser().getId().equals(user.getId()) &&
                        (member.getRole() == Role.ADMIN || member.getRole() == Role.MEMBER));
        if (!hasPermission) {
            throw new IllegalArgumentException("You do not have the necessary permissions to perform this action.");
        }
    }

    private void validateAssigneeIsProjectMember(User assignee, Project project) {
        boolean isMember = project.getMembers().stream()
                .anyMatch(member -> member.getUser().getId().equals(assignee.getId()));
        if (!isMember) {
            throw new IllegalArgumentException("The assigned user is not a member of the project.");
        }
    }

    private TaskDto mapToDto(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus(),
                task.getCreatedBy().getId(),
                task.getAssignee() != null ? task.getAssignee().getId() : null,
                task.getProject().getId()
        );
    }

    @Transactional
    public TaskDto assignTaskToProject(Long projectId, Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (!task.getProject().getId().equals(projectId)) {
            throw new IllegalArgumentException("Task does not belong to the specified project.");
        }

        if (task.getAssignee() != null) {
            throw new IllegalArgumentException("Task is already assigned to a user.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        boolean isMember = task.getProject().getMembers().stream()
                .anyMatch(member -> member.getUser().getId().equals(user.getId()) &&
                        (member.getRole() == Role.MEMBER || member.getRole() == Role.ADMIN));

        if (!isMember) {
            throw new IllegalArgumentException("User is not a member of the project or does not have the required role.");
        }

        task.setAssignee(user);
        Task updatedTask = taskRepository.save(task);

        // Send email notification to project members
        List<String> recipientEmails = task.getProject().getMembers().stream()
                .map(member -> member.getUser().getEmail())
                .toList();

        String subject = "Nouvelle tâche assignée : " + task.getTitle();
        String content = String.format("""
    <html>
        <body>
            <p>Bonjour,</p>
            <p>Une nouvelle tâche a été assignée dans le projet <strong>%s</strong>.</p>
            <p>
                <strong>Titre de la tâche :</strong> %s<br>
                <strong>Description :</strong> %s<br>
                <strong>Date d'échéance :</strong> %s
            </p>
            <p>Cordialement,<br>L'équipe PMT</p>
        </body>
    </html>
    """,
                task.getProject().getName(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate() != null ? task.getDueDate().toString() : "Non spécifiée"
        );

        emailService.sendEmail(subject, content, recipientEmails);

        return mapToDto(updatedTask);
    }
}