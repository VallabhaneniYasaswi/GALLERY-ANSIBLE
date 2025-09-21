package com.klef.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlist_items")
public class WishlistItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private Long artworkId;
    private String artworkTitle;
    private String artworkImage;
    private double price;
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
	public String getArtworkTitle() {
		return artworkTitle;
	}
	public void setArtworkTitle(String artworkTitle) {
		this.artworkTitle = artworkTitle;
	}
	public String getArtworkImage() {
		return artworkImage;
	}
	public void setArtworkImage(String artworkImage) {
		this.artworkImage = artworkImage;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}

    // getters / setters
}
