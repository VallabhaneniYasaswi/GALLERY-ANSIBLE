package com.klef.model;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.klef.repository.UsersRepository;
import com.klef.repository.VisitorProfileRepository;

@Service
public class VisitorProfileManager {

    private final String UPLOAD_DIR = "uploads_visitors";

    @Autowired
    private VisitorProfileRepository VPR;

    @Autowired
    private UsersRepository UR;

    @Autowired
    private JWTManager JWT;

    // Create or update profile
    public String createOrUpdateProfile(String token, String bio, String gender, MultipartFile imageFile) {
        var data = JWT.validateToken(token);
        if (data == null) return "401::Invalid token";

        String email = data.get("email");
        Users user = UR.findById(email).orElse(null);
        if (user == null || user.getRole() != 3) return "403::Unauthorized";

        VisitorProfile profile = VPR.findByEmail(email);
        if (profile == null) profile = new VisitorProfile();

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

        VPR.save(profile);
        return "200::Profile saved successfully";
    }

    public VisitorProfile getProfile(String token) {
        var data = JWT.validateToken(token);
        if (data == null) return null;

        String email = data.get("email");
        Users user = UR.findById(email).orElse(null);
        if (user == null || user.getRole() != 3) return null;

        VisitorProfile profile = VPR.findByEmail(email);
        if (profile == null) {
            profile = new VisitorProfile();
            profile.setEmail(user.getEmail());
            profile.setFullname(user.getFullname());
        }
        return profile;
    }

    public String deleteProfile(String token) {
        var data = JWT.validateToken(token);
        if (data == null) return "401::Invalid token";

        String email = data.get("email");
        VisitorProfile profile = VPR.findByEmail(email);
        if (profile == null) return "404::Profile not found";

        if (profile.getImage() != null) {
            Path path = Paths.get(UPLOAD_DIR, profile.getImage());
            try { Files.deleteIfExists(path); } catch (IOException e) {}
        }

        VPR.delete(profile);
        return "200::Profile deleted successfully";
    }
}
