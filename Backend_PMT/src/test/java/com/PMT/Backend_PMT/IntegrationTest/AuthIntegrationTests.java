package com.PMT.Backend_PMT.IntegrationTest;

import com.PMT.Backend_PMT.dto.AuthDto;
import com.PMT.Backend_PMT.dto.UserDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.repository.UserRepository;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:applicationTest.properties")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenHolder tokenHolder;

//    private final UserDto newUser = UserDto.builder()
//            .username("testuser")
//            .email("testuser@pmt.com")
//            .password("Testpass123!")
//            .build();

    @BeforeAll
    void loginUser() throws Exception {
        // Créer un utilisateur pour le test si nécessaire
        if (!userRepository.existsByEmail("testuser@pmt.com")) {
            userRepository.save(User.builder()
                    .username("testuser")
                    .email("testuser@pmt.com")
                    .passwordHash(passwordEncoder.encode("Testpass123!"))
                    .build());
        }

        // Effectuer la connexion
        AuthDto loginRequest = new AuthDto("testuser@pmt.com", "Testpass123!");
        String requestBody = objectMapper.writeValueAsString(loginRequest);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andReturn();

        String token = result.getResponse().getContentAsString();
        tokenHolder.setToken(token); // Stocker le token pour les autres tests
    }

    @Test
    @Order(1)
    @DisplayName("Create new user - Success")
    void signupNewUser_Success() throws Exception {
        // Utiliser un email unique pour éviter les conflits
        UserDto uniqueUser = UserDto.builder()
                .username("newuniqueuser")
                .email("newuniqueuser@pmt.com")
                .password("UniquePass123!")
                .build();

        String requestBody = objectMapper.writeValueAsString(uniqueUser);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email").value(uniqueUser.getEmail()))
                .andExpect(jsonPath("$.username").value(uniqueUser.getUsername()));
    }

//    @Test
//    @Order(2)
//    @DisplayName("User login - Success")
//    void loginUser_Success() throws Exception {
//        // Vérifier si l'utilisateur existe déjà
//        if (!userRepository.existsByEmail(newUser.getEmail())) {
//            userRepository.save(User.builder()
//                    .username(newUser.getUsername())
//                    .email(newUser.getEmail())
//                    .passwordHash(passwordEncoder.encode(newUser.getPassword()))
//                    .build());
//        }
//
//        AuthDto loginRequest = new AuthDto(newUser.getEmail(), newUser.getPassword());
//        String requestBody = objectMapper.writeValueAsString(loginRequest);
//
//        MvcResult result = mockMvc.perform(post("/api/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestBody))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("text/plain;charset=UTF-8"))
//                .andReturn();
//
//        String token = result.getResponse().getContentAsString();
//        tokenHolder.setToken(token); // Stocker le token
//        System.out.println("Token généré : " + token);
//        Assertions.assertNotNull(token, "Token should not be null");
//    }
}