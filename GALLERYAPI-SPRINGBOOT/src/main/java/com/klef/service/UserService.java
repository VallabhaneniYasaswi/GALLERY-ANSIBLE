package com.klef.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.model.Users;
import com.klef.repository.UsersRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UsersRepository userRepository;

    public List<Users> findByRole(int roleId) {
        return userRepository.findByRole(roleId);
    }
}
