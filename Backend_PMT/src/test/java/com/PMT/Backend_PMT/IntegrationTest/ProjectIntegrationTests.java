package com.PMT.Backend_PMT.IntegrationTest;

import com.PMT.Backend_PMT.dto.InviteMemberDto;
import com.PMT.Backend_PMT.dto.ProjectDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.enumeration.Role;
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

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:applicationTest.properties")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ProjectIntegrationTests {

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

    private Long projectId;

    @Test
    @Order(1)
    @DisplayName("Create project - Success")
    void createProject_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        // Retrieve the connected user
        User user = userRepository.findByEmail("testuser@pmt.com")
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Create a new project
        ProjectDto newProject = ProjectDto.builder()
                .name("Test Project")
                .description("Test project description")
                .startDate(LocalDate.now())
                .createdById(user.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(newProject);

        MvcResult result = mockMvc.perform(post("/api/projects/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andReturn();


        // Retrieve the ID of the created project
        String responseBody = result.getResponse().getContentAsString();
        projectId = objectMapper.readTree(responseBody).get("id").asLong();
        testDataHolder.setProjectId(projectId);
        Assertions.assertNotNull(projectId, "The project ID must not be null");
    }

    @Test
    @Order(2)
    @DisplayName("Update project - Success")
    void updateProject_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        // Get the connected user
        User user = userRepository.findByEmail("testuser@pmt.com")
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Create a new project
        ProjectDto initialProject = ProjectDto.builder()
                .name("Initial Project")
                .description("Initial description")
                .startDate(LocalDate.now())
                .createdById(user.getId())
                .build();

        String initialRequestBody = objectMapper.writeValueAsString(initialProject);

        MvcResult result = mockMvc.perform(post("/api/projects/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(initialRequestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Long projectId = objectMapper.readTree(responseBody).get("id").asLong();

        // Update the project
        ProjectDto updatedProject = ProjectDto.builder()
                .name("Updated Project")
                .description("Updated description")
                .startDate(LocalDate.now().plusDays(10))
                .createdById(user.getId())
                .build();

        String updateRequestBody = objectMapper.writeValueAsString(updatedProject);

        mockMvc.perform(put("/api/projects/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(updateRequestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(projectId))
                .andExpect(jsonPath("$.name").value(updatedProject.getName()))
                .andExpect(jsonPath("$.description").value(updatedProject.getDescription()))
                .andExpect(jsonPath("$.startDate").value(updatedProject.getStartDate().toString()));
    }

    @Test
    @Order(3)
    @DisplayName("Get project by ID - Success")
    void getProjectById_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        // Get the project by ID
        mockMvc.perform(get("/api/projects/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(projectId))
                .andExpect(jsonPath("$.name").value("Test Project"))
                .andExpect(jsonPath("$.description").value("Test project description"));
    }


    @Test
    @Order(4)
    @DisplayName("Get all projects - Success")
    void getAllProjects_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        // Get all projects
        mockMvc.perform(get("/api/projects/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").isNotEmpty());
    }

    @Test
    @Order(5)
    @DisplayName("Delete project - Success")
    void deleteProject_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        // Create a project to delete
        User user = userRepository.findByEmail("testuser@pmt.com")
                .orElseThrow(() -> new IllegalStateException("User not found"));

        ProjectDto projectToDelete = ProjectDto.builder()
                .name("Project to Delete")
                .description("Description of the project to delete")
                .startDate(LocalDate.now())
                .createdById(user.getId())
                .build();

        String requestBody = objectMapper.writeValueAsString(projectToDelete);

        MvcResult result = mockMvc.perform(post("/api/projects/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Long projectIdToDelete = objectMapper.readTree(responseBody).get("id").asLong();

        // Delete the project
        mockMvc.perform(delete("/api/projects/{id}", projectIdToDelete)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        // Verify that the project is deleted
        mockMvc.perform(get("/api/projects/{id}", projectIdToDelete)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(6)
    @DisplayName("Invite member to project - Success")
    void inviteMemberToProject_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");
        Assertions.assertNotNull(projectId, "The project ID must not be null");

        // Verify that the project exists
        mockMvc.perform(get("/api/projects/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // Retrieve the user created by createUser_Success
        User user = userRepository.findByEmail("newuser@pmt.com")
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Prepare the invitation request
        InviteMemberDto inviteMemberDto = new InviteMemberDto(user.getEmail(), Role.MEMBER);
        String requestBody = objectMapper.writeValueAsString(inviteMemberDto);

        // Invite the user to the project
        mockMvc.perform(post("/api/projects/{projectId}/invite", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated());
    }
}