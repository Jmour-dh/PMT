package com.PMT.Backend_PMT.IntegrationTest;

import com.PMT.Backend_PMT.dto.UserDto;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.PMT.Backend_PMT.util.TokenHolder tokenHolder;

    @Test
    @Order(1)
    @DisplayName("Create user - Success")
    void createUser_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        UserDto newUser = UserDto.builder()
                .username("newuser")
                .email("newuser@pmt.com")
                .password("Newpass123!")
                .build();

        String requestBody = objectMapper.writeValueAsString(newUser);

        mockMvc.perform(post("/api/users/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value(newUser.getUsername()))
                .andExpect(jsonPath("$.email").value(newUser.getEmail()));
    }

    @Test
    @Order(2)
    @DisplayName("Update user - Success")
    void updateUser_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        UserDto newUser = UserDto.builder()
                .username("tempuser")
                .email("tempuser@pmt.com")
                .password("TempPass123!")
                .build();

        String requestBody = objectMapper.writeValueAsString(newUser);

        MvcResult result = mockMvc.perform(post("/api/users/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Long userId = objectMapper.readTree(responseBody).get("id").asLong();

        UserDto updatedUser = UserDto.builder()
                .username("updateduser")
                .email("updateduser@pmt.com")
                .password("UpdatedPass123!")
                .build();

        String updateRequestBody = objectMapper.writeValueAsString(updatedUser);

        mockMvc.perform(put("/api/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(updateRequestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(userId))
                .andExpect(jsonPath("$.username").value(updatedUser.getUsername()))
                .andExpect(jsonPath("$.email").value(updatedUser.getEmail()));
    }

    @Test
    @Order(3)
    @DisplayName("Get user by ID - Success")
    void getUserById_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        UserDto newUser = UserDto.builder()
                .username("getbyiduser")
                .email("tempuser@pmt.com")
                .password("TempPass123!")
                .build();

        String requestBody = objectMapper.writeValueAsString(newUser);

        MvcResult result = mockMvc.perform(post("/api/users/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Long userId = objectMapper.readTree(responseBody).get("id").asLong();

        mockMvc.perform(get("/api/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(userId))
                .andExpect(jsonPath("$.username").value(newUser.getUsername()))
                .andExpect(jsonPath("$.email").value(newUser.getEmail()));
    }

    @Test
    @Order(4)
    @DisplayName("Get all users - Success")
    void getAllUsers_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        // Get all users
        mockMvc.perform(get("/api/users/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").isNotEmpty());
    }

    @Test
    @Order(5)
    @DisplayName("Delete user - Success")
    void deleteUser_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "The authentication token must not be null");
        Assertions.assertFalse(token.isBlank(), "The authentication token must not be empty");

        // Create a user to delete
        UserDto newUser = UserDto.builder()
                .username("deleteuser")
                .email("deleteuser@pmt.com")
                .password("DeletePass123!")
                .build();

        String requestBody = objectMapper.writeValueAsString(newUser);

        MvcResult result = mockMvc.perform(post("/api/users/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Long userId = objectMapper.readTree(responseBody).get("id").asLong();

        // Delete the user
        mockMvc.perform(delete("/api/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        // Check if the user is deleted
        mockMvc.perform(get("/api/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

}