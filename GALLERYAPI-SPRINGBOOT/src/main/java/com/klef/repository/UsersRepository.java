package com.klef.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.klef.model.Users;


@Repository 
public interface UsersRepository extends JpaRepository<Users, String>{
	@Query("select count(U) from Users U where U.email =:email")
	public int validateEmail(@Param("email") String email);
	
	@Query("select count(U) from Users U where U.email =:email and U.password =:password")
	public int validateCresentials(@Param("email") String email, @Param("password") String password);
	
	List<Users> findByRole(int role);
	// <-- Add this 
    Users findByEmail(String email);
    

}
