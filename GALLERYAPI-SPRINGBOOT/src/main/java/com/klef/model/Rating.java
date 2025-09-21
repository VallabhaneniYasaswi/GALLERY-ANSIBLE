package com.klef.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ratings", uniqueConstraints = @UniqueConstraint(columnNames = {"userEmail","artworkId"}))
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private Long artworkId;
    private int stars; // 1-5
    private String comment;
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public Long getArtworkId() {
		return artworkId;
	}
	public void setArtworkId(Long artworkId) {
		this.artworkId = artworkId;
	}
	public int getStars() {
		return stars;
	}
	public void setStars(int stars) {
		this.stars = stars;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}

    // getters / setters
}
