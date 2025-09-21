package com.klef.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.klef.model.Artwork;
import com.klef.model.ArtworkManager;

@RestController
@RequestMapping("/artist/artworks")
@CrossOrigin(origins="*")
public class ArtworkController {

    @Autowired
    ArtworkManager AM;

    @PostMapping("/add")
    public String addArtwork(@RequestHeader("Authorization") String token,
                             @RequestParam String title,
                             @RequestParam String description,
                             @RequestParam double price,
                             @RequestParam(required=false) MultipartFile image) {
        token = token.replace("Bearer ", "");
        return AM.addArtwork(token, title, description, price, image);
    }

    @GetMapping("/all")
    public List<Artwork> getAllArtworks() {
        return AM.getAllArtworks();
    }

    @GetMapping("/my")
    public List<Artwork> getMyArtworks(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return AM.getMyArtworks(token);
    }

    @PutMapping("/update/{id}") // change from @PostMapping
    public String updateArtwork(@RequestHeader("Authorization") String token,
                                @PathVariable Long id,
                                @RequestParam String title,
                                @RequestParam String description,
                                @RequestParam double price,
                                @RequestParam(required=false) MultipartFile image) {
        token = token.replace("Bearer ", "");
        return AM.updateArtwork(token, id, title, description, price, image);
    }


    @DeleteMapping("/delete/{id}")
    public String deleteArtwork(@RequestHeader("Authorization") String token,
                                @PathVariable Long id) {
        token = token.replace("Bearer ", "");
        return AM.deleteArtwork(token, id);
    }
}
