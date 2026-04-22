# 🍽️ AP Restaurant Management System

A production-ready full-stack restaurant seat reservation web application featuring strict Spring Security, JWT authentication, and role-based access control for both **customers** and **admins**.

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19 | Component-based UI |
| Vite | ^8 | Fast build tool |
| Tailwind CSS | ^4 | Utility-first styling & Glassmorphism |
| React Router DOM | ^7 | Client-side routing |
| Lucide React | ^0.3 | Beautiful SVG icons |

### Backend
| Technology | Details | Purpose |
|---|---|---|
| Spring Boot | 4.0.5 | REST Java Framework |
| Spring Security | with JWT | Stateless Auth & API Protection |
| Java | 24 | Core Language |
| Spring Data JPA | Hibernate ORM | Database interaction |
| PostgreSQL | Database | Persistent relational storage |
| BCrypt | Security | Password hashing |

---

## ✨ Features

- **Stateless Authentication** — Backend utilizes JSON Web Tokens (JWT) meaning it scales efficiently without storing session memory. Passwords are mathematically hashed via BCrypt.
- **Strict Route Protection** — The Spring Security Filter Chain blocks all data mutations and views unless the HTTP request headers contain a strictly valid Bearer token.
- **Role-Based Access Control** — Complete separation between `admin` and `user` accounts.
- **Customer Portal (`ROLE_USER`)**
  - **Self-Serve Registration:** Anyone can sign up directly.
  - **Booking:** Logged-in customers can book available tables via dynamic forms.
  - **My Reservations:** A personal hub to view, modify (PUT), and cancel (DELETE) only their own bookings safely verified by their JWT claims.
- **Admin Control Panel (`ROLE_ADMIN`)**
  - View **all** system-wide reservations.
  - Cancel any reservation as an override.
  - Add and manage the restaurant's physical floor tables and capacities.

---

## ⚙️ Prerequisites

- **Node.js** (v18+) and **npm**
- **Java 21+** (JDK)
- **Maven**
- **PostgreSQL** — running locally on port `5432`

---

## 🚀 Getting Started

### 1. Database Setup

Create a PostgreSQL database on your local server:

```sql
CREATE DATABASE restaurant_db;
```

### 2. Configure the Backend

Open `backend/src/main/resources/application.properties` and verify your Postgres credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/restaurant_db
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password
spring.jpa.hibernate.ddl-auto=update
server.port=8081
```

### 3. Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

> **Automated Seeding:** On first boot, the system automatically inserts two root accounts so you do not get locked out:
> - **Admin Login:** `admin` | **Password:** `admin`
> - **Default User Login:** `user` | **Password:** `user`

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

> Navigate to `http://localhost:5173`. The backend APIs run strictly on `8081` but have no Graphical Interface!

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account | Public |
| `POST` | `/api/auth/login` | Receive a JWT token | Public |

### Reservations
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/reservations` | Create a new reservation | Authenticated |
| `GET` | `/api/reservations` | View all reservations | ADMIN |
| `GET` | `/api/reservations/my` | View token-owner's reservations | USER |
| `DELETE`| `/api/reservations/{id}`| Cancel a reservation | ADMIN or Owner |
| `PUT` | `/api/reservations/{id}`| Modify a reservation | ADMIN or Owner |

### Tables
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/tables` | Get all restaurant tables | Public |
| `POST` | `/api/tables` | Add a new physical table | ADMIN |

---

## 🗂️ Data Models & Relationships

- **User**: Represents a registered account (`id`, `username`, `password`, `role`).
- **RestaurantTable**: Represents a physical object in the diner (`id`, `tableNumber`, `seatingCapacity`).
- **Reservation**: Joins a `User` and `RestaurantTable` along with contact details and dates. Mapped to `User` via `@ManyToOne`.

---

## 📜 License

This project is for educational/personal use.
