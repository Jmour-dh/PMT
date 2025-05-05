package com.PMT.Backend_PMT.IntegrationTest;

import com.PMT.Backend_PMT.dto.TaskDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.enumeration.TaskPriority;
import com.PMT.Backend_PMT.enumeration.TaskStatus;
import com.PMT.Backend_PMT.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:applicationTest.properties")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class TaskIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.PMT.Backend_PMT.util.TokenHolder tokenHolder;

    @Autowired
    private com.PMT.Backend_PMT.util.TestDataHolder testDataHolder;

    @Test
    @Order(1)
    @DisplayName("Create task - Success")
    void createTask_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");

        Long projectId = testDataHolder.getProjectId();
        Assertions.assertNotNull(projectId, "The projectId must be defined before running this test.");

        TaskDto newTask = TaskDto.builder()
                .title("New Task")
                .description("Task description")
                .dueDate(LocalDateTime.now().plusDays(7))
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.TODO)
                .createdById(userRepository.findByEmail("testuser@pmt.com")
                        .orElseThrow(() -> new IllegalStateException("User not found"))
                        .getId())
                .projectId(projectId)
                .build();

        String requestBody = objectMapper.writeValueAsString(newTask);

        mockMvc.perform(post("/api/tasks/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated());
    }

    @Test
    @Order(2)
    @DisplayName("Update task - Success")
    void updateTask_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");

        Long projectId = testDataHolder.getProjectId();
        Assertions.assertNotNull(projectId, "The projectId must be defined before running this test.");

        // Create a task to update
        LocalDateTime initialDueDate = LocalDateTime.now().plusDays(7).truncatedTo(ChronoUnit.SECONDS);
        TaskDto initialTask = TaskDto.builder()
                .title("Initial Task")
                .description("Initial description")
                .dueDate(initialDueDate)
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.TODO)
                .createdById(userRepository.findByEmail("testuser@pmt.com").orElseThrow().getId())
                .projectId(projectId)
                .build();

        String initialRequestBody = objectMapper.writeValueAsString(initialTask);

        MvcResult result = mockMvc.perform(post("/api/tasks/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(initialRequestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Long taskId = objectMapper.readTree(responseBody).get("id").asLong();

        // Update the task
        LocalDateTime updatedDueDate = LocalDateTime.now().plusDays(14).truncatedTo(ChronoUnit.SECONDS);
        TaskDto updatedTask = TaskDto.builder()
                .title("Updated Task")
                .description("Updated description")
                .dueDate(updatedDueDate)
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.IN_PROGRESS)
                .createdById(initialTask.getCreatedById())
                .projectId(projectId)
                .build();

        String updateRequestBody = objectMapper.writeValueAsString(updatedTask);

        mockMvc.perform(put("/api/tasks/{id}", taskId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(updateRequestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(taskId))
                .andExpect(jsonPath("$.title").value(updatedTask.getTitle()))
                .andExpect(jsonPath("$.description").value(updatedTask.getDescription()))
                .andExpect(jsonPath("$.dueDate").value(updatedDueDate.toString()))
                .andExpect(jsonPath("$.priority").value(updatedTask.getPriority().toString()))
                .andExpect(jsonPath("$.status").value(updatedTask.getStatus().toString()));
    }

    @Test
    @Order(3)
    @DisplayName("Get task by ID - Success")
    void getTaskById_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");

        Long projectId = testDataHolder.getProjectId();
        Assertions.assertNotNull(projectId, "The projectId must be defined before running this test.");

        // Create a task to retrieve
        TaskDto newTask = TaskDto.builder()
                .title("Task to Retrieve")
                .description("Description of the task to retrieve")
                .dueDate(LocalDateTime.now().plusDays(7).truncatedTo(ChronoUnit.SECONDS))
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.TODO)
                .createdById(userRepository.findByEmail("testuser@pmt.com").orElseThrow().getId())
                .projectId(projectId)
                .build();

        String requestBody = objectMapper.writeValueAsString(newTask);

        MvcResult result = mockMvc.perform(post("/api/tasks/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Long taskId = objectMapper.readTree(responseBody).get("id").asLong();

        // Retrieve the task by ID
        mockMvc.perform(get("/api/tasks/{id}", taskId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(taskId))
                .andExpect(jsonPath("$.title").value(newTask.getTitle()))
                .andExpect(jsonPath("$.description").value(newTask.getDescription()));
    }

    @Test
    @Order(4)
    @DisplayName("Get all tasks - Success")
    void getAllTasks_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");

        // Retrieve all tasks
        mockMvc.perform(get("/api/tasks/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").isNotEmpty());
    }

    @Test
    @Order(5)
    @DisplayName("Delete task - Success")
    void deleteTask_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");

        Long projectId = testDataHolder.getProjectId();
        Assertions.assertNotNull(projectId, "The projectId must be defined before running this test.");

        TaskDto taskToDelete = TaskDto.builder()
                .title("Task to Delete")
                .description("Description of the task to delete")
                .dueDate(LocalDateTime.now().plusDays(7).truncatedTo(ChronoUnit.SECONDS))
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.TODO)
                .createdById(userRepository.findByEmail("testuser@pmt.com").orElseThrow().getId())
                .projectId(projectId)
                .build();

        String requestBody = objectMapper.writeValueAsString(taskToDelete);

        MvcResult result = mockMvc.perform(post("/api/tasks/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Long taskId = objectMapper.readTree(responseBody).get("id").asLong();

        mockMvc.perform(delete("/api/tasks/{id}?userId={userId}", taskId, taskToDelete.getCreatedById())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/tasks/{id}", taskId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(6)
    @DisplayName("Assign task to project - Success")
    void assignTaskToProject_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");

        Long projectId = testDataHolder.getProjectId();
        Assertions.assertNotNull(projectId, "The projectId must be defined before running this test.");

        TaskDto newTask = TaskDto.builder()
                .title("Task to Assign")
                .description("Description of the task to assign")
                .dueDate(LocalDateTime.now().plusDays(7).truncatedTo(ChronoUnit.SECONDS))
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.TODO)
                .createdById(userRepository.findByEmail("testuser@pmt.com").orElseThrow().getId())
                .projectId(projectId)
                .build();

        String taskRequestBody = objectMapper.writeValueAsString(newTask);

        MvcResult taskResult = mockMvc.perform(post("/api/tasks/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(taskRequestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String taskResponseBody = taskResult.getResponse().getContentAsString();
        Long taskId = objectMapper.readTree(taskResponseBody).get("id").asLong();

        User user = userRepository.findByEmail("testuser@pmt.com")
                .orElseThrow(() -> new IllegalStateException("User not found"));

        mockMvc.perform(patch("/api/tasks/{projectId}/{taskId}/assign/{userId}", projectId, taskId, user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(taskId))
                .andExpect(jsonPath("$.assigneeId").value(user.getId()));
    }
}