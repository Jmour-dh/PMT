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

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    private Long projectId;


    @Test
    @Order(1)
    @DisplayName("Create task - Success")
    void createTask_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "Le token d'authentification ne doit pas être null");

        Long projectId = testDataHolder.getProjectId();
        Assertions.assertNotNull(projectId, "Le projectId doit être défini avant d'exécuter ce test.");

        TaskDto newTask = TaskDto.builder()
                .title("Nouvelle tâche")
                .description("Description de la tâche")
                .dueDate(LocalDateTime.now().plusDays(7))
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.TODO)
                .createdById(userRepository.findByEmail("testuser@pmt.com")
                        .orElseThrow(() -> new IllegalStateException("Utilisateur non trouvé"))
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
}