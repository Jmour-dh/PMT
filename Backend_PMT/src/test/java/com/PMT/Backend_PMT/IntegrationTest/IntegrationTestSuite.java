package com.PMT.Backend_PMT.IntegrationTest;

import com.PMT.Backend_PMT.dto.AuthDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.repository.UserRepository;
import com.PMT.Backend_PMT.util.TestDataHolder;
import com.PMT.Backend_PMT.util.TokenHolder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestPropertySource(locations = "classpath:application-test.properties")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class IntegrationTestSuite {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenHolder tokenHolder;

    @Autowired
    private TestDataHolder testDataHolder;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthIntegrationTests authIntegrationTests;

    @Autowired
    private UserIntegrationTests userIntegrationTests;

    @Autowired
    private ProjectIntegrationTests projectIntegrationTests;

    @Autowired
    private TaskIntegrationTests taskIntegrationTests;

    @BeforeAll
    void initializeDatabase() throws Exception {
        userRepository.deleteAll();
        authIntegrationTests.loginUser_Success();
    }

    @Test
    @Order(1)
    void runAuthIntegrationTests() throws Exception {
        authIntegrationTests.signupNewUser_Success();
        authIntegrationTests.loginUser_Success();
    }

    @Test
    @Order(2)
    void runUserIntegrationTests() throws Exception {
        userIntegrationTests.createUser_Success();
        userIntegrationTests.updateUser_Success();
        userIntegrationTests.getUserById_Success();
        userIntegrationTests.getAllUsers_Success();
        userIntegrationTests.deleteUser_Success();
    }

    @Test
    @Order(3)
    void runProjectIntegrationTests() throws Exception {
        projectIntegrationTests.createProject_Success();
        projectIntegrationTests.updateProject_Success();
        projectIntegrationTests.getProjectById_Success();
        projectIntegrationTests.getAllProjects_Success();
        projectIntegrationTests.deleteProject_Success();
        projectIntegrationTests.inviteMemberToProject_Success();
    }

    @Test
    @Order(4)
    void runTaskIntegrationTests() throws Exception {
        taskIntegrationTests.createTask_Success();
        taskIntegrationTests.updateTask_Success();
        taskIntegrationTests.getTaskById_Success();
        taskIntegrationTests.getAllTasks_Success();
        taskIntegrationTests.deleteTask_Success();
        taskIntegrationTests.assignTaskToProject_Success();
    }



}