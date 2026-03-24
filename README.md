# Online Appointment Booking Application

Complete full-stack appointment booking system.

## Project Structure

- **backend/** - Express.js REST API
- **frontend/** - React + Vite UI

## Quick Start

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Running Both

Terminal 1:
```bash
cd backend
npm install
npm start
```

Terminal 2:
```bash
cd frontend
npm install
npm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Features

- Browse service providers
- Book appointments
- Manage your bookings
- Leave reviews and ratings
- Admin dashboard
- Responsive design

---

## Backend Details

A comprehensive **Online Appointment Booking API** built with Node.js and Express, using **in-memory data storage** — no database required!

## Features

### User Management
- User registration and login (customers & service providers)
- JWT-based authentication with refresh tokens
- Role-based access control (Customer, Service Provider, Admin)

### Appointment Booking
- Browse available service providers and services
- View available time slots by provider and date
- Book, cancel, and reschedule appointments
- Appointment status tracking (pending → confirmed/rejected → completed/cancelled)

### Service Provider Management
- Provider dashboard with stats
- Manage time slot availability (create, block, unblock, delete)
- Confirm, reject, or complete appointment requests
- Manage service offerings

### Admin Panel
- View all users, providers, and appointments
- Activate/deactivate users
- System statistics and analytics

### Data Persistence (Optional)
- Pure in-memory: data lives while the server is running
- Sample data initialized on startup

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Joi |
| API Docs | Swagger/OpenAPI (swagger-ui-express) |
| Testing | Jest + Supertest |
| Security | Helmet, CORS, express-rate-limit |

## Project Structure

```
online-appointment-booking-application/
├── config/
│   ├── environment.js      # Environment configuration
│   ├── jwt.js              # JWT configuration
│   └── constants.js        # App constants (roles, statuses)
├── controllers/
│   ├── authController.js
│   ├── appointmentController.js
│   ├── serviceProviderController.js
│   ├── userController.js
│   └── adminController.js
├── routes/
│   ├── authRoutes.js
│   ├── appointmentRoutes.js
│   ├── serviceProviderRoutes.js
│   ├── userRoutes.js
│   └── adminRoutes.js
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── errorHandler.js        # Global error handler
│   ├── validationMiddleware.js # Joi validation
│   └── roleMiddleware.js      # Role-based access control
├── services/
│   ├── dataService.js         # In-memory data store
│   ├── userService.js
│   ├── appointmentService.js
│   ├── serviceProviderService.js
│   ├── timeSlotService.js
│   └── notificationService.js
├── utils/
│   ├── validators.js          # Joi schemas
│   ├── helpers.js             # Utility functions
│   └── constants.js
├── tests/
│   ├── auth.test.js
│   ├── appointment.test.js
│   ├── serviceProvider.test.js
│   └── user.test.js
├── public/
│   └── swagger.json           # OpenAPI documentation
├── .env.example
├── .gitignore
├── server.js
└── package.json
```

## Getting Started

### Prerequisites
- Node.js >= 16.x
- npm >= 8.x

### Installation

```bash
# Clone the repository
git clone https://github.com/ShreeyashPatil2708/online-appointment-booking-application.git
cd online-appointment-booking-application

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Running the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server starts on `http://localhost:3000` by default.

### API Documentation

Once running, visit: **http://localhost:3000/api-docs**

### Health Check

```
GET /health
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Appointments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/appointments` | Book appointment | Customer |
| GET | `/api/appointments/my` | Get my appointments | Any |
| GET | `/api/appointments/:id` | Get appointment details | Owner/Provider |
| PATCH | `/api/appointments/:id/cancel` | Cancel appointment | Owner |
| PATCH | `/api/appointments/:id/reschedule` | Reschedule | Owner |
| PATCH | `/api/appointments/:id/confirm` | Confirm | Provider |
| PATCH | `/api/appointments/:id/reject` | Reject | Provider |
| PATCH | `/api/appointments/:id/complete` | Complete | Provider |

### Service Providers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/providers` | List all providers | Public |
| GET | `/api/providers/:id` | Get provider | Public |
| GET | `/api/providers/:id/slots` | Get slots | Public |
| GET | `/api/providers/:id/reviews` | Get reviews | Public |
| GET | `/api/providers/me/profile` | My profile | Provider |
| PUT | `/api/providers/me/profile` | Update profile | Provider |
| GET | `/api/providers/me/appointments` | My appointments | Provider |
| GET | `/api/providers/me/stats` | My stats | Provider |
| POST | `/api/providers/me/slots` | Add time slot | Provider |
| PATCH | `/api/providers/me/slots/:slotId/block` | Block slot | Provider |
| PATCH | `/api/providers/me/slots/:slotId/unblock` | Unblock slot | Provider |
| DELETE | `/api/providers/me/slots/:slotId` | Delete slot | Provider |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get my profile | Any |
| PUT | `/api/users/profile` | Update profile | Any |
| GET | `/api/users/notifications` | Get notifications | Any |
| PATCH | `/api/users/notifications/:id/read` | Mark notification read | Any |
| POST | `/api/users/reviews` | Add a review | Customer |
| GET | `/api/users/reviews` | Get my reviews | Any |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | System statistics | Admin |
| GET | `/api/admin/users` | All users | Admin |
| GET | `/api/admin/users/:id` | Get user | Admin |
| PATCH | `/api/admin/users/:id/deactivate` | Deactivate user | Admin |
| PATCH | `/api/admin/users/:id/activate` | Activate user | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/providers` | All providers | Admin |
| GET | `/api/admin/appointments` | All appointments | Admin |

## Sample Data

On server startup, the following sample data is created:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Customer | john@example.com | customer123 |
| Service Provider | alice@example.com | provider123 |
| Service Provider | bob@example.com | provider123 |

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `JWT_SECRET` | *(required)* | JWT signing secret |
| `JWT_EXPIRES_IN` | `24h` | Access token expiry |
| `JWT_REFRESH_SECRET` | *(required)* | Refresh token secret |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token expiry |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `CORS_ORIGIN` | `*` | CORS allowed origins |

## License

MIT
