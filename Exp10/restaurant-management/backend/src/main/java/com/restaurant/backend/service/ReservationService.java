package com.restaurant.backend.service;

import com.restaurant.backend.model.Reservation;
import com.restaurant.backend.model.RestaurantTable;
import com.restaurant.backend.repository.ReservationRepository;
import com.restaurant.backend.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.UserRepository;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Reservation> getMyReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return reservationRepository.findByUserUsername(auth.getName());
        }
        return List.of();
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation createReservation(Reservation reservation) {
        Long tableId = reservation.getRestaurantTable().getId();
        Optional<RestaurantTable> tableOpt = restaurantTableRepository.findById(tableId);

        if (tableOpt.isEmpty()) {
            throw new IllegalArgumentException("Table with ID " + tableId + " does not exist.");
        }

        RestaurantTable table = tableOpt.get();
        if (reservation.getNumberOfGuests() > table.getSeatingCapacity()) {
            throw new IllegalArgumentException("Number of guests exceeds table capacity.");
        }

        // Check availability (e.g. within 2 hours of another reservation)
        LocalDateTime requestedTime = reservation.getReservationTime();
        LocalDateTime windowStart = requestedTime.minusHours(2);
        LocalDateTime windowEnd = requestedTime.plusHours(2);

        List<Reservation> conflicts = reservationRepository.findByRestaurantTableIdAndReservationTimeBetween(tableId, windowStart, windowEnd);
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Table is already booked during this time.");
        }

        reservation.setRestaurantTable(table);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            Optional<User> userOpt = userRepository.findByUsername(auth.getName());
            userOpt.ifPresent(reservation::setUser);
        }

        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation with ID " + id + " does not exist."));
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            String username = auth.getName();
            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = reservation.getUser() != null && reservation.getUser().getUsername().equals(username);

            if (!isAdmin && !isOwner) {
                throw new SecurityException("You do not have permission to delete this reservation.");
            }
        } else {
            throw new SecurityException("Authentication is required.");
        }
        
        reservationRepository.deleteById(id);
    }

    public Reservation updateReservation(Long id, Reservation updatedData) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation with ID " + id + " does not exist."));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            String username = auth.getName();
            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isOwner = reservation.getUser() != null && reservation.getUser().getUsername().equals(username);

            if (!isAdmin && !isOwner) {
                throw new SecurityException("You do not have permission to update this reservation.");
            }
        } else {
            throw new SecurityException("Authentication is required.");
        }

        Long tableId = updatedData.getRestaurantTable().getId();
        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new IllegalArgumentException("Table with ID " + tableId + " does not exist."));

        if (updatedData.getNumberOfGuests() > table.getSeatingCapacity()) {
            throw new IllegalArgumentException("Number of guests exceeds table capacity.");
        }

        // Check availability (exclude self)
        LocalDateTime requestedTime = updatedData.getReservationTime();
        LocalDateTime windowStart = requestedTime.minusHours(2);
        LocalDateTime windowEnd = requestedTime.plusHours(2);

        List<Reservation> conflicts = reservationRepository.findByRestaurantTableIdAndReservationTimeBetween(tableId, windowStart, windowEnd);
        boolean hasConflict = conflicts.stream().anyMatch(r -> !r.getId().equals(id));
        if (hasConflict) {
            throw new IllegalArgumentException("Table is already booked during this time.");
        }

        reservation.setCustomerName(updatedData.getCustomerName());
        reservation.setCustomerEmail(updatedData.getCustomerEmail());
        reservation.setCustomerPhone(updatedData.getCustomerPhone());
        reservation.setReservationTime(updatedData.getReservationTime());
        reservation.setNumberOfGuests(updatedData.getNumberOfGuests());
        reservation.setRestaurantTable(table);

        return reservationRepository.save(reservation);
    }
}
