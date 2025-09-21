package com.klef.service;

import com.klef.model.ArtistProfile;
import com.klef.model.Users;
import com.klef.repository.ArtistProfileRepository;
import com.klef.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ArtistService {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private ArtistProfileRepository profileRepository;

    public List<ArtistProfile> getAllArtists() {
        List<Users> artists = userRepository.findByRole(2); // role=2 means Artist
        List<ArtistProfile> result = new ArrayList<>();

        for (Users artist : artists) {
            ArtistProfile profile = profileRepository.findByEmail(artist.getEmail());

            if (profile == null) {
                // if artist has no profile yet, create a dummy profile with fullname+email
                profile = new ArtistProfile();
                profile.setEmail(artist.getEmail());
                profile.setFullname(artist.getFullname());
                profile.setBio(null);
                profile.setGender(null);
                profile.setImage(null);
            }

            result.add(profile);
        }
        return result;
    }
}
