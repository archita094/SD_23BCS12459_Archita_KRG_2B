package com.restaurant.backend;

import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User("admin", passwordEncoder.encode("admin"), "ROLE_ADMIN");
            User customer = new User("user", passwordEncoder.encode("user"), "ROLE_USER");
            
            userRepository.save(admin);
            userRepository.save(customer);
            
            System.out.println("Seeded database with default 'admin' and 'user' accounts.");
        }
    }
}
