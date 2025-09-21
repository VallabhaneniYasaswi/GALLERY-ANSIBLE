package com.klef.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.klef.model.Artwork;
import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByArtistEmail(String email);
}
