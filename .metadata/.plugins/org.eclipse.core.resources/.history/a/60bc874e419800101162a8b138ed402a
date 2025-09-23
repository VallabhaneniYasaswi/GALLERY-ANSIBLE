package com.klef.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.klef.model.ArtistProfile;
import com.klef.model.ArtistProfileManager;

@RestController
@RequestMapping("/artist")
@CrossOrigin(origins="*")
public class ArtistProfileController {

    @Autowired
    ArtistProfileManager APM;

    @PostMapping("/profile")
    public String createOrUpdateProfile(
        @RequestParam("bio") String bio,
        @RequestParam("gender") String gender,
        @RequestParam(value="image", required=false) MultipartFile image,
        @RequestHeader("Authorization") String token
    ) {
        token = token.replace("Bearer ", "");
        return APM.createOrUpdateProfile(token, bio, gender, image);
    }

    @GetMapping("/profile")
    public ArtistProfile getProfile(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return APM.getProfile(token);
    }

    @DeleteMapping("/profile")
    public String deleteProfile(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return APM.deleteProfile(token);
    }
}
