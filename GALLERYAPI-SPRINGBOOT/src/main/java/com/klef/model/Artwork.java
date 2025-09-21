package com.klef.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name="artist_artworks")
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String artistName;

    @Column(nullable = false)
    private String artistEmail;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private double price;

    private String image; // filename

    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadedAt = new Date();

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getArtistEmail() { return artistEmail; }
    public void setArtistEmail(String artistEmail) { this.artistEmail = artistEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Date getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Date uploadedAt) { this.uploadedAt = uploadedAt; }
}
