package com.klef.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klef.model.Users;
import com.klef.model.UsersManager;

@RestController 
@RequestMapping("/users")
@CrossOrigin(origins="*")
public class UsersController {
    @Autowired
    UsersManager UM;
    
    @PostMapping("/signup")
    public String signUp(@RequestBody Users U) {
        return UM.addUser(U);
    }
    
    @GetMapping("/forgotpassword/{email}")
    public String forgotPassword(@PathVariable("email") String emailid) {
        return UM.recoverPassword(emailid);
    }
    
    @PostMapping("/signin")
    public String signIn(@RequestBody Users U) {
        return UM.validateCredentials(U.getEmail(), U.getPassword());
    }
    
    @PostMapping("/getfullname")
    public String getFullname(@RequestBody Map<String, String> data) {
        return UM.getFullname(data.get("csrid"));
    }
}
