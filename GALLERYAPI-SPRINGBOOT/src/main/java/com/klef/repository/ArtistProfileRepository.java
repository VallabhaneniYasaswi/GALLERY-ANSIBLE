package com.klef.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.klef.model.ArtistProfile;

@Repository
public interface ArtistProfileRepository extends JpaRepository<ArtistProfile, Long> {
    ArtistProfile findByEmail(String email);
}
