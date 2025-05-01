package com.PMT.Backend_PMT.unitTest;

import com.PMT.Backend_PMT.controller.AuthController;
import com.PMT.Backend_PMT.dto.AuthDto;
import com.PMT.Backend_PMT.dto.UserDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.service.AuthService;
import com.PMT.Backend_PMT.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    private AuthService authService;
    private UserService userService;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        userService = mock(UserService.class);
        authController = new AuthController(authService, userService);
    }

    @Test
    void testLogin() {
        String token = "mocked-jwt-token";
        AuthDto loginRequest = new AuthDto();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
        when(authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword())).thenReturn(token);

        var response = authController.login(loginRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(token, response.getBody());
    }

    @Test
    void testSignup() {
        User createdUser = new User(1L, "testuser", "test@example.com", "hashedPassword", null, null, null, null);
        UserDto userDto = new UserDto(null, "testuser", "test@example.com", "password123", null, null);
        when(userService.createUser(userDto)).thenReturn(createdUser);

        var response = authController.signup(userDto);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());
    }
}