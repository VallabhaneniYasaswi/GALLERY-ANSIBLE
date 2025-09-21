package com.klef.model;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.klef.repository.ArtistProfileRepository;
import com.klef.repository.UsersRepository;

@Service
public class ArtistProfileManager {

    private final String UPLOAD_DIR = "uploads_dir"; // folder in backend

    @Autowired
    ArtistProfileRepository APR;

    @Autowired
    UsersRepository UR;

    @Autowired
    JWTManager JWT;

    // Create or update profile
    public String createOrUpdateProfile(String token, String bio, String gender, MultipartFile imageFile) {
        var data = JWT.validateToken(token);
        if (data == null) return "401::Invalid or expired token";

        String email = data.get("email");
        Users user = UR.findById(email).orElse(null);
        if (user == null) return "404::User not found";

        ArtistProfile profile = APR.findByEmail(email);
        if (profile == null) profile = new ArtistProfile();

        profile.setEmail(email);
        profile.setFullname(user.getFullname());
        profile.setBio(bio);
        profile.setGender(gender);

        // handle file upload
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                File dir = new File(UPLOAD_DIR);
                if (!dir.exists()) dir.mkdirs();
                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR, filename);
                Files.write(path, imageFile.getBytes());
                profile.setImage(filename);
            } catch (IOException e) {
                return "500::File upload error: " + e.getMessage();
            }
        }

        APR.save(profile);
        return "200::Profile saved successfully";
    }

    public ArtistProfile getProfile(String token) {
        var data = JWT.validateToken(token);
        if (data == null) return null;

        String email = data.get("email");
        Users user = UR.findById(email).orElse(null);
        if (user == null) return null;

        ArtistProfile profile = APR.findByEmail(email);
        if (profile == null) {
            // return a new profile with fullname & email even if profile not created yet
            profile = new ArtistProfile();
            profile.setEmail(user.getEmail());
            profile.setFullname(user.getFullname());
        }
        return profile;
    }


    // Delete profile
    public String deleteProfile(String token) {
        var data = JWT.validateToken(token);
        if (data == null) return "401::Invalid or expired token";

        String email = data.get("email");
        ArtistProfile profile = APR.findByEmail(email);
        if (profile == null) return "404::Profile not found";

        // delete image from folder
        if (profile.getImage() != null) {
            Path path = Paths.get(UPLOAD_DIR, profile.getImage());
            try { Files.deleteIfExists(path); } catch (IOException e) {}
        }

        APR.delete(profile);
        return "200::Profile deleted successfully";
    }
}
