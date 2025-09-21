package com.klef.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.repository.UsersRepository;

@Service 
public class UsersManager {
    @Autowired 
    UsersRepository UR;
    
    @Autowired 
    EmailManager EM;
    
    @Autowired 
    JWTManager JWT;

    // Add User
    public String addUser(Users U) {
        if(UR.validateEmail(U.getEmail()) > 0)
            return "401::Email already exist";
        UR.save(U);
        return "200::User Registered Successfully"; 
    }

    // Recover password
    public String recoverPassword(String email) {
        Users U = UR.findById(email).orElse(null);
        if(U == null) return "404::User not found";
        String message = String.format("Dear %s, \n \n Your Password is: %s", U.getFullname(), U.getPassword());
        return EM.sendEmail(U.getEmail(), "JobPortal : Password Recovery", message); 
    }

    // Validate Credentials and return token + role
//    public String validateCredentials(String email, String password) {
//        Users U = UR.findById(email).orElse(null);
//        if(U == null || !U.getPassword().equals(password))
//            return "401::Invalid Credential(Check Username and Password)";
//        
//        String token = JWT.generateToken(U.getEmail(), U.getRole());
//        return "200::" + token + "::" + U.getRole(); // include role
//    }
    
 // Validate Credentials and return token + role
 // Validate Credentials and return token + role (role as int)
    public String validateCredentials(String email, String password) {
        Users U = UR.findById(email).orElse(null);
        if (U == null || !U.getPassword().equals(password)) {
            return "401::Invalid Credential(Check Username and Password)";
        }

        String token = JWT.generateToken(U.getEmail()); // JWT only has email
        return "200::" + token + "::" + U.getRole();    // role as int
    }



    public String getFullname(String token) {
        var data = JWT.validateToken(token);
        if(data == null) return "401::Token Expired!";
        Users U = UR.findById(data.get("email")).orElse(null);
        if(U == null) return "404::User not found";
        return U.getFullname(); 
    }
    public List<Users> getAllUsers() {
        return UR.findAll(); // fetch all users
    }

    public String deleteUser(String email) {
        Users u = UR.findById(email).orElse(null);
        if (u == null) return "404::User not found";
        UR.delete(u);
        return "200::User deleted successfully";
    }

    public String updateUserRole(String email, int role) {
        Users u = UR.findById(email).orElse(null);
        if (u == null) return "404::User not found";
        u.setRole(role);
        UR.save(u);
        return "200::User role updated successfully";
    }
}
