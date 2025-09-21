package com.klef.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.model.Artwork;
import com.klef.model.CartItem;
import com.klef.model.WishlistItem;
import com.klef.model.Order;
import com.klef.model.OrderItem;
import com.klef.model.Rating;
import com.klef.repository.ArtworkRepository;
import com.klef.repository.CartItemRepository;
import com.klef.repository.WishlistItemRepository;
import com.klef.repository.OrderRepository;
import com.klef.repository.RatingRepository;
import com.klef.model.JWTManager;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitorCommerceManager {

    @Autowired
    private ArtworkRepository artworkRepo;

    @Autowired
    private CartItemRepository cartRepo;

    @Autowired
    private WishlistItemRepository wishlistRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private RatingRepository ratingRepo;

    @Autowired
    private JWTManager jwt;

    // -------------------- CART --------------------

    public String addToCart(String token, Long artworkId, int quantity) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        String email = data.get("email");
        Artwork artwork = artworkRepo.findById(artworkId).orElse(null);
        if (artwork == null) return "404::Artwork not found";

        CartItem ci = new CartItem();
        ci.setUserEmail(email);
        ci.setArtworkId(artwork.getId());
        ci.setArtworkTitle(artwork.getTitle());
        ci.setArtworkImage(artwork.getImage());
        ci.setPrice(artwork.getPrice());
        ci.setQuantity(quantity);

        cartRepo.save(ci);
        return "200::Added to cart";
    }

    public List<CartItem> getCart(String token) {
        var data = jwt.validateToken(token);
        if (data == null) return new ArrayList<>();
        return cartRepo.findByUserEmail(data.get("email"));
    }

//    public String removeFromCart(String token, Long artworkId) {
//        var data = jwt.validateToken(token);
//        if (data == null) return "401::Invalid token";
//
//        cartRepo.deleteByUserEmailAndArtworkId(data.get("email"), artworkId);
//        return "200::Removed from cart";
//    }
    public String removeFromCart(String token, Long artworkId) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        List<CartItem> items = cartRepo.findByUserEmail(data.get("email"));
        boolean removed = items.removeIf(c -> c.getArtworkId().equals(artworkId));
        if (!removed) return "404::Item not found in cart";

        cartRepo.deleteByUserEmailAndArtworkId(data.get("email"), artworkId);
        return "200::Removed from cart";
    }


    // -------------------- WISHLIST --------------------

    public String addToWishlist(String token, Long artworkId) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        String email = data.get("email");
        Artwork artwork = artworkRepo.findById(artworkId).orElse(null);
        if (artwork == null) return "404::Artwork not found";

        WishlistItem wi = new WishlistItem();
        wi.setUserEmail(email);
        wi.setArtworkId(artwork.getId());
        wi.setArtworkTitle(artwork.getTitle());
        wi.setArtworkImage(artwork.getImage());
        wi.setPrice(artwork.getPrice());

        wishlistRepo.save(wi);
        return "200::Added to wishlist";
    }

    public List<WishlistItem> getWishlist(String token) {
        var data = jwt.validateToken(token);
        if (data == null) return new ArrayList<>();
        return wishlistRepo.findByUserEmail(data.get("email"));
    }

//    public String removeFromWishlist(String token, Long artworkId) {
//        var data = jwt.validateToken(token);
//        if (data == null) return "401::Invalid token";
//
//        wishlistRepo.deleteByUserEmailAndArtworkId(data.get("email"), artworkId);
//        return "200::Removed from wishlist";
//    }
    public String removeFromWishlist(String token, Long artworkId) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        List<WishlistItem> items = wishlistRepo.findByUserEmail(data.get("email"));
        boolean removed = items.removeIf(w -> w.getArtworkId().equals(artworkId));
        if (!removed) return "404::Item not found in wishlist";

        wishlistRepo.deleteByUserEmailAndArtworkId(data.get("email"), artworkId);
        return "200::Removed from wishlist";
    }

    // -------------------- ORDERS --------------------
    
    @Transactional
    public String checkout(String token) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        String email = data.get("email");
        List<CartItem> cartItems = cartRepo.findByUserEmail(email);
        if (cartItems.isEmpty()) return "400::Cart is empty";

        Order order = new Order();
        order.setUserEmail(email);

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;
        for (CartItem ci : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setArtworkId(ci.getArtworkId());
            oi.setArtworkTitle(ci.getArtworkTitle());
            oi.setArtworkImage(ci.getArtworkImage());
            oi.setPrice(ci.getPrice());
            oi.setQuantity(ci.getQuantity());
            orderItems.add(oi);
            total += ci.getPrice() * ci.getQuantity();
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);
        order.setStatus("CREATED");

        orderRepo.save(order);
        cartRepo.deleteAll(cartItems);

        return "200::Order created::" + order.getId();
    }

    public List<Order> getOrders(String token) {
        var data = jwt.validateToken(token);
        if (data == null) return new ArrayList<>();
        return orderRepo.findByUserEmail(data.get("email"));
    }

    // -------------------- RATINGS --------------------

    public String rateArtwork(String token, Long artworkId, int stars, String comment) {
        var data = jwt.validateToken(token);
        if (data == null) return "401::Invalid token";

        String email = data.get("email");
        Artwork artwork = artworkRepo.findById(artworkId).orElse(null);
        if (artwork == null) return "404::Artwork not found";

        Rating existing = ratingRepo.findByUserEmailAndArtworkId(email, artworkId);
        if (existing != null) {
            existing.setStars(stars);
            existing.setComment(comment);
            ratingRepo.save(existing);
            return "200::Rating updated";
        }

        Rating r = new Rating();
        r.setUserEmail(email);
        r.setArtworkId(artworkId);
        r.setStars(stars);
        r.setComment(comment);

        ratingRepo.save(r);
        return "200::Artwork rated";
    }

    public List<Rating> getRatings(Long artworkId) {
        return ratingRepo.findByArtworkId(artworkId);
    }
}

