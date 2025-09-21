package com.klef.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.klef.model.VisitorProfile;

@Repository
public interface VisitorProfileRepository extends JpaRepository<VisitorProfile, Long> {
    VisitorProfile findByEmail(String email);
}
