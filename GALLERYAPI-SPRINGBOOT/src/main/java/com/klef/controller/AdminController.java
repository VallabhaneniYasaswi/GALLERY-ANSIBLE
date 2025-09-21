package com.klef.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klef.model.Users;
import com.klef.model.UsersManager;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins="*")
public class AdminController {

    @Autowired
    UsersManager UM;

    // Get all users
    @GetMapping("/users")
    public List<Users> getAllUsers(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        // Optionally, check if token belongs to admin role
        return UM.getAllUsers();
    }

    // Delete a user by email
    @DeleteMapping("/users/{email}")
    public String deleteUser(@PathVariable String email, @RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return UM.deleteUser(email);
    }

    // Update user's role
    @PutMapping("/users/{email}")
    public String updateUserRole(@PathVariable String email, @RequestBody Users data, @RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return UM.updateUserRole(email, data.getRole());
    }
}
