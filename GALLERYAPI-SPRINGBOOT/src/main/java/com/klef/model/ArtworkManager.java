package com.klef.model;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.klef.repository.ArtworkRepository;
import com.klef.repository.UsersRepository;

@Service
public class ArtworkManager {

    private final String UPLOAD_DIR = "uploads_artworks";

    @Autowired
    ArtworkRepository AR;

    @Autowired
    JWTManager JWT;

    // Upload / create artwork
//    public String addArtwork(String token, String title, String description, double price, MultipartFile imageFile) {
//        var data = JWT.validateToken(token);
//        if(data == null) return "401::Invalid or expired token";
//
//        String email = data.get("email");
//        String artistName = data.get("role") != null ? data.get("email") : "Unknown";
//
//        Artwork artwork = new Artwork();
//        artwork.setArtistEmail(email);
//        artwork.setArtistName(artistName);
//        artwork.setTitle(title);
//        artwork.setDescription(description);
//        artwork.setPrice(price);
//
//        // handle file upload
//        if(imageFile != null && !imageFile.isEmpty()) {
//            try {
//                File dir = new File(UPLOAD_DIR);
//                if(!dir.exists()) dir.mkdirs();
//
//                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
//                Path path = Paths.get(UPLOAD_DIR, filename);
//                Files.write(path, imageFile.getBytes());
//
//                artwork.setImage(filename);
//            } catch(IOException e) {
//                return "500::File upload failed: " + e.getMessage();
//            }
//        }
//
//        AR.save(artwork);
//        return "200::Artwork uploaded successfully";
//    }
    @Autowired
    private UsersRepository userRepo; // inject your User repository

    public String addArtwork(String token, String title, String description, double price, MultipartFile imageFile) {
        var data = JWT.validateToken(token);
        if(data == null) return "401::Invalid or expired token";

        String email = data.get("email");

        // Fetch artist full name from Users table
        Users artist = userRepo.findByEmail(email);
        String artistName = (artist != null) ? artist.getFullname() : "Unknown";

        Artwork artwork = new Artwork();
        artwork.setArtistEmail(email);
        artwork.setArtistName(artistName);
        artwork.setTitle(title);
        artwork.setDescription(description);
        artwork.setPrice(price);

        // handle file upload
        if(imageFile != null && !imageFile.isEmpty()) {
            try {
                File dir = new File(UPLOAD_DIR);
                if(!dir.exists()) dir.mkdirs();

                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR, filename);
                Files.write(path, imageFile.getBytes());

                artwork.setImage(filename);
            } catch(IOException e) {
                return "500::File upload failed: " + e.getMessage();
            }
        }

        AR.save(artwork);
        return "200::Artwork uploaded successfully";
    }


    // Get all artworks
    public List<Artwork> getAllArtworks() {
        return AR.findAll();
    }

    // Get artworks of current artist
    public List<Artwork> getMyArtworks(String token) {
        var data = JWT.validateToken(token);
        if(data == null) return null;
        return AR.findByArtistEmail(data.get("email"));
    }

    // Update artwork
    public String updateArtwork(String token, Long id, String title, String description, double price, MultipartFile imageFile) {
        var data = JWT.validateToken(token);
        if(data == null) return "401::Invalid or expired token";

        Artwork artwork = AR.findById(id).orElse(null);
        if(artwork == null) return "404::Artwork not found";
        if(!artwork.getArtistEmail().equals(data.get("email"))) return "403::Unauthorized";

        artwork.setTitle(title);
        artwork.setDescription(description);
        artwork.setPrice(price);

        // update image if provided
        if(imageFile != null && !imageFile.isEmpty()) {
            try {
                if(artwork.getImage() != null) Files.deleteIfExists(Paths.get(UPLOAD_DIR, artwork.getImage()));

                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path path = Paths.get(UPLOAD_DIR, filename);
                Files.write(path, imageFile.getBytes());

                artwork.setImage(filename);
            } catch(IOException e) {
                return "500::File upload failed: " + e.getMessage();
            }
        }

        AR.save(artwork);
        return "200::Artwork updated successfully";
    }

    // Delete artwork
    public String deleteArtwork(String token, Long id) {
        var data = JWT.validateToken(token);
        if(data == null) return "401::Invalid or expired token";

        Artwork artwork = AR.findById(id).orElse(null);
        if(artwork == null) return "404::Artwork not found";
        if(!artwork.getArtistEmail().equals(data.get("email"))) return "403::Unauthorized";

        // delete image file
        if(artwork.getImage() != null) {
            try { Files.deleteIfExists(Paths.get(UPLOAD_DIR, artwork.getImage())); } catch(IOException e) {}
        }

        AR.delete(artwork);
        return "200::Artwork deleted successfully";
    }
}
