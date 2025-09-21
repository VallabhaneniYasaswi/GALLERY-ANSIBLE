package com.klef.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByArtworkId(Long artworkId);
    Rating findByUserEmailAndArtworkId(String userEmail, Long artworkId);
}
