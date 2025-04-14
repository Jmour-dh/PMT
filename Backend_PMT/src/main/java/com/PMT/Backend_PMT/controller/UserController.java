package com.PMT.Backend_PMT.controller;

import com.PMT.Backend_PMT.dto.UserDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDto userDto) {
        User createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<UserDto>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}
