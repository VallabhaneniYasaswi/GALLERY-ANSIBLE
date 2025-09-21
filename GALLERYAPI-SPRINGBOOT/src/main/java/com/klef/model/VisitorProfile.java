package com.klef.model;

import jakarta.persistence.*;

@Entity
@Table(name="visitor_profiles")
public class VisitorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email; // FK to Users

    @Column(nullable = false)
    private String fullname; // from Users

    @Column(length = 1000)
    private String bio;

    private String gender;

    private String image; // filename

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
