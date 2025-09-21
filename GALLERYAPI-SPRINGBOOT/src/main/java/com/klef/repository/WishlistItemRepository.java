package com.klef.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.klef.model.WishlistItem;
import java.util.List;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserEmail(String email);

    @Transactional
    void deleteByUserEmailAndArtworkId(String email, Long artworkId);
}
