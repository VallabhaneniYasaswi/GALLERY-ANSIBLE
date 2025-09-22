package com.klef.service;

import com.klef.model.Artwork;
import com.klef.model.JWTManager;
import com.klef.model.Users;
import com.klef.repository.ArtworkRepository;
import com.klef.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ArtworkService {
    private final String UPLOAD_DIR = "uploads_artworks";

    @Autowired
    private ArtworkRepository artworkRepo;

    @Autowired
    private UsersRepository usersRepo;

    @Autowired
    private JWTManager jwt;

    // Create
    public String addArtwork(String token, String title, String description, Double price, MultipartFile imageFile) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        String email = data.get("email");
        Users user = usersRepo.findById(email).orElse(null);
        if (user == null) return "404::User not found";

        Artwork artwork = new Artwork();
        artwork.setArtistEmail(email);
        artwork.setArtistName(user.getFullname());
        artwork.setTitle(title);
        artwork.setDescription(description);
        artwork.setPrice(price);

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                File dir = new File(UPLOAD_DIR);
                if (!dir.exists()) dir.mkdirs();
                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR, filename);
                Files.write(path, imageFile.getBytes());
                artwork.setImage(filename);
            } catch (IOException e) {
                return "500::File upload failed";
            }
        }

        artworkRepo.save(artwork);
        return "200::Artwork added successfully";
    }

    // Read: get all artworks of logged-in artist
    public List<Artwork> getMyArtworks(String token) {
        var data = jwt.validateToken(token);
        if (data == null) return null;
        String email = data.get("email");
        return artworkRepo.findByArtistEmail(email);
    }

    // Update
    public String updateArtwork(String token, Long id, String title, String description, Double price, MultipartFile imageFile) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        Artwork artwork = artworkRepo.findById(id).orElse(null);
        if (artwork == null) return "404::Artwork not found";

        if (!artwork.getArtistEmail().equals(data.get("email"))) {
            return "403::Not your artwork";
        }

        artwork.setTitle(title);
        artwork.setDescription(description);
        artwork.setPrice(price);

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                File dir = new File(UPLOAD_DIR);
                if (!dir.exists()) dir.mkdirs();
                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR, filename);
                Files.write(path, imageFile.getBytes());
                artwork.setImage(filename);
            } catch (IOException e) {
                return "500::File upload failed";
            }
        }

        artworkRepo.save(artwork);
        return "200::Artwork updated";
    }

    // Delete
    public String deleteArtwork(String token, Long id) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        Artwork artwork = artworkRepo.findById(id).orElse(null);
        if (artwork == null) return "404::Artwork not found";

        if (!artwork.getArtistEmail().equals(data.get("email"))) {
            return "403::Not your artwork";
        }

        if (artwork.getImage() != null) {
            try { Files.deleteIfExists(Paths.get(UPLOAD_DIR, artwork.getImage())); } catch (IOException e) {}
        }

        artworkRepo.delete(artwork);
        return "200::Artwork deleted";
    }
}
