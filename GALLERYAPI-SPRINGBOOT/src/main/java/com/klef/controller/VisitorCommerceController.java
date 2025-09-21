package com.klef.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klef.model.CartItem;
import com.klef.model.WishlistItem;
import com.klef.model.Order;
import com.klef.model.Rating;
import com.klef.model.VisitorCommerceManager;

@RestController
@RequestMapping("/visitor/commerce")
@CrossOrigin(origins = "*")
public class VisitorCommerceController {

    @Autowired
    private VisitorCommerceManager manager;

    // -------------------- CART --------------------
    @PostMapping("/cart/add")
    public String addToCart(@RequestHeader("Authorization") String token,
                            @RequestParam Long artworkId,
                            @RequestParam int quantity) {
        token = token.replace("Bearer ", "");
        return manager.addToCart(token, artworkId, quantity);
    }

    @GetMapping("/cart")
    public List<CartItem> getCart(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return manager.getCart(token);
    }

    @DeleteMapping("/cart/remove")
    public String removeFromCart(@RequestHeader("Authorization") String token,
                                 @RequestParam Long artworkId) {
        token = token.replace("Bearer ", "");
        return manager.removeFromCart(token, artworkId);
    }

    // -------------------- WISHLIST --------------------
    @PostMapping("/wishlist/add")
    public String addToWishlist(@RequestHeader("Authorization") String token,
                                @RequestParam Long artworkId) {
        token = token.replace("Bearer ", "");
        return manager.addToWishlist(token, artworkId);
    }

    @GetMapping("/wishlist")
    public List<WishlistItem> getWishlist(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return manager.getWishlist(token);
    }

    @DeleteMapping("/wishlist/remove")
    public String removeFromWishlist(@RequestHeader("Authorization") String token,
                                     @RequestParam Long artworkId) {
        token = token.replace("Bearer ", "");
        return manager.removeFromWishlist(token, artworkId);
    }

    // -------------------- ORDERS --------------------
    @PostMapping("/checkout")
    public String checkout(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return manager.checkout(token);
    }

    @GetMapping("/orders")
    public List<Order> getOrders(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        return manager.getOrders(token);
    }

    // -------------------- RATINGS --------------------
    @PostMapping("/rating")
    public String rateArtwork(@RequestHeader("Authorization") String token,
                              @RequestParam Long artworkId,
                              @RequestParam int stars,
                              @RequestParam(required = false) String comment) {
        token = token.replace("Bearer ", "");
        return manager.rateArtwork(token, artworkId, stars, comment);
    }

    @GetMapping("/ratings/{artworkId}")
    public List<Rating> getRatings(@PathVariable Long artworkId) {
        return manager.getRatings(artworkId);
    }
}
