# PetHaven: Pet Adoption System

IT342 Systems Integration and Architecture 1 (G01), Irish Jean Q. Manubag

PetHaven is a website and mobile application that connects adopters with verified animal shelters and independent rescuers. Shelters list pets, adopters apply online, and administrators verify shelters and moderate listings.

## Increment 1: User Accounts and Authentication

| Feature | SRS |
|---|---|
| Adopter registration with field validation and duplicate-email check | FR-001 |
| Shelter / Rescuer registration, saved as PENDING | FR-002 |
| Login with JWT access token (expires in 60 minutes) | FR-003, NFR-008 |
| Role-based access control: ADOPTER, SHELTER, ADMIN (401 / 403) | FR-004, NFR-009 |
| Suspended accounts blocked; lockout after 5 failed logins for 15 minutes | FR-005, FR-008 |
| Logout (client discards the token) | FR-006 |
| Role-based dashboards with redirect after login | Feature 1 |
| Admin: list pending shelters, verify or reject with reason | FR-054, FR-055 |
| Passwords stored as BCrypt hashes (cost 12) | NFR-007 |

## Tech stack

- **Frontend:** ReactJS (Vite), React Router, Axios
- **Backend:** Spring Boot 4, Spring Security, Spring Data JPA, JJWT
- **Database:** PostgreSQL (Supabase)

## Requirements

- Java 21 or newer
- Node.js 20.19 or newer (22 LTS recommended)
- A Supabase project (PostgreSQL)

## Setup

### 1. Clone
```bash
git clone https://github.com/LikeJean30-prog/Manubag_PetHaven_Pet_Adoption_System.git
cd Manubag_PetHaven_Pet_Adoption_System
```

### 2. Backend environment variables
Create `backend/.env` (it is ignored by Git and must never be committed):
```
DB_URL=jdbc:postgresql://<supabase-session-pooler-host>:5432/postgres
DB_USERNAME=<supabase-user>
DB_PASSWORD=<supabase-database-password>
JWT_SECRET=<base64 random key, at least 48 bytes>
ADMIN_EMAIL=<first administrator email>
ADMIN_PASSWORD=<first administrator password>
```
- Use the **Session pooler** connection from Supabase → Connect → Direct → JDBC.
- Generate a JWT key in PowerShell:
  `$b = New-Object byte[] 48; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)`
- The administrator account is created automatically on first startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (SRS assumption A-05). Admins cannot self-register.

### 3. Run the backend (port 8080)
```bash
cd backend
./mvnw spring-boot:run        # Windows: .\mvnw spring-boot:run
```
Tables are created automatically in Supabase on first run.

### 4. Run the frontend (port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. The Vite dev server forwards `/api` requests to the backend.

## API endpoints (Increment 1)

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register/adopter | Public |
| POST | /api/auth/register/shelter | Public |
| POST | /api/auth/login | Public |
| GET | /api/users/me | Any logged-in user |
| GET | /api/shelter/me | SHELTER |
| GET | /api/admin/shelters?status=PENDING | ADMIN |
| PATCH | /api/admin/shelters/{id}/verification | ADMIN |

## Project structure
```
backend/   Spring Boot REST API (controller → service → repository)
frontend/  React website
```