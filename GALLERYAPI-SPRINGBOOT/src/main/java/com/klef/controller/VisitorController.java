package com.klef.controller;

import com.klef.model.ArtistProfile;
import com.klef.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visitor")
@CrossOrigin(origins = "*")
public class VisitorController {

    @Autowired
    private ArtistService artistService;

    @GetMapping("/artists")
    public List<ArtistProfile> getArtists() {
        return artistService.getAllArtists();
    }
}
