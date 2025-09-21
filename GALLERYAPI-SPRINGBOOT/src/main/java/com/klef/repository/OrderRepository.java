package com.klef.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserEmail(String email);
}
