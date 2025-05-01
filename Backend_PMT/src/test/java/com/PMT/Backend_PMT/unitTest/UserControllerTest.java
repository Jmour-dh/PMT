package com.PMT.Backend_PMT.unitTest;

import com.PMT.Backend_PMT.controller.UserController;
import com.PMT.Backend_PMT.dto.UserDetailsDto;
import com.PMT.Backend_PMT.dto.UserDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserControllerTest {

    private UserService userService;
    private UserController userController;

    @BeforeEach
    void setUp() {
        userService = mock(UserService.class);
        userController = new UserController(userService);
    }

    @Test
    void testGetAllUsers() {
        when(userService.getAllUsers()).thenReturn(Collections.emptyList());

        var response = userController.getAllUsers();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetUserById() {
        UserDetailsDto userDetailsDto = new UserDetailsDto(1L, "testuser", "test@example.com", null, null, null, null);
        when(userService.getUserById(1L)).thenReturn(userDetailsDto);

        var response = userController.getUserById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());
    }

    @Test
    void testCreateUser() {
        User createdUser = new User(1L, "testuser", "test@example.com", "hashedPassword", null, null, null, null);
        UserDto userDto = new UserDto(null, "testuser", "test@example.com", "password123", null, null);
        when(userService.createUser(userDto)).thenReturn(createdUser);

        var response = userController.createUser(userDto);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals("testuser", response.getBody().getUsername());
        assertEquals("test@example.com", response.getBody().getEmail());
    }

    @Test
    void testUpdateUser() {
        User updatedUser = new User(1L, "updateduser", "updated@example.com", "hashedPassword", null, null, null, null);
        UserDto userDto = new UserDto(null, "updateduser", "updated@example.com", "newpassword123", null, null);
        when(userService.updateUser(1L, userDto)).thenReturn(updatedUser);

        var response = userController.updateUser(1L, userDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("updateduser", response.getBody().getUsername());
        assertEquals("updated@example.com", response.getBody().getEmail());
    }

    @Test
    void testDeleteUser() {
        Mockito.doNothing().when(userService).deleteUser(1L);

        var response = userController.deleteUser(1L);

        assertEquals(204, response.getStatusCodeValue());
        Mockito.verify(userService, Mockito.times(1)).deleteUser(1L);
    }
}