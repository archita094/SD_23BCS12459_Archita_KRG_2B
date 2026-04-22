package com.restaurant.backend.repository;

import com.restaurant.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByRestaurantTableIdAndReservationTimeBetween(Long tableId, LocalDateTime start, LocalDateTime end);
    List<Reservation> findByUserUsername(String username);
}
