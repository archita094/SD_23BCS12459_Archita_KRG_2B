package com.restaurant.backend.controller;

import com.restaurant.backend.model.RestaurantTable;
import com.restaurant.backend.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class RestaurantTableController {

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return restaurantTableRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<RestaurantTable> addTable(@RequestBody RestaurantTable table) {
        if (restaurantTableRepository.findByTableNumber(table.getTableNumber()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        RestaurantTable savedTable = restaurantTableRepository.save(table);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTable);
    }
}
