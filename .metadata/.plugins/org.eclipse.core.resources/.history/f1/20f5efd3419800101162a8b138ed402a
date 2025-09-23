package com.klef.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.klef.model.VisitorProfile;
import com.klef.model.VisitorProfileManager;

@RestController
@RequestMapping("/visitor")
@CrossOrigin(origins="*")
public class VisitorProfileController {

    @Autowired
    VisitorProfileManager VPM;

    @PostMapping("/profile")
    public String createOrUpdateProfile(
        @RequestParam("bio") String bio,
        @RequestParam("gender") String gender,
        @RequestParam(value="image", required=false) MultipartFile image,
        @RequestHeader("Authorization") String token
    ) {
        token = token.replace("Bearer ", "");
        return VPM.createOrUpdateProfile(token, bio, gender, image);
    }

    @GetMapping("/profile")
    public VisitorProfile getProfile(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return VPM.getProfile(token);
    }

    @DeleteMapping("/profile")
    public String deleteProfile(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return VPM.deleteProfile(token);
    }
}
