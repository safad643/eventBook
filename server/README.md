# Event Booking Platform — Backend API

A RESTful backend API for an event booking platform built with Node.js, Express 5, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** Joi
- **File Uploads:** Multer (memory) + Cloudinary
- **Email:** Nodemailer (Gmail SMTP)
- **Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Security:** cors, helmet, morgan

## Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or local)
- Cloudinary account
- Gmail App Password (for Nodemailer)

## Installation

```bash
# Clone the repo
git clone <repo-url>
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your actual values

# Seed the database
npm run seed

# Start development server
npm run dev
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon server.js` | Start with auto-reload |
| `start` | `node server.js` | Production start |
| `seed` | `node utils/seed.js` | Seed database with sample data |

## API Documentation

Once the server is running, visit: **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

## Folder Structure

```
server/
├── config/
│   ├── db.js                  # MongoDB connection
│   ├── cloudinary.js          # Cloudinary + multer setup
│   └── nodemailer.js          # Email transporter
├── controllers/
│   ├── authController.js      # register, login, getMe
│   ├── serviceController.js   # getServices, getServiceById
│   ├── bookingController.js   # createBooking, getMyBookings, cancelBooking
│   └── adminController.js     # CRUD services, getAdminBookings
├── middleware/
│   ├── auth.js                # JWT verification
│   ├── role.js                # Role-based authorization
│   ├── validate.js            # Joi validation
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js
│   ├── Service.js
│   └── Booking.js
├── routes/
│   ├── authRoutes.js
│   ├── serviceRoutes.js
│   ├── bookingRoutes.js
│   └── adminRoutes.js
├── validators/
│   ├── authValidator.js
│   ├── serviceValidator.js
│   └── bookingValidator.js
├── utils/
│   ├── sendEmail.js
│   └── seed.js
├── swagger.js
├── app.js
├── server.js
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Services (Public) — `/api/services`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/services` | List services (filter, search, paginate) | No |
| GET | `/api/services/:id` | Get single service | No |

### Bookings — `/api/bookings`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create a booking | Yes |
| GET | `/api/bookings` | Get my bookings | Yes |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking | Yes |

### Admin — `/api/admin`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/admin/services` | Create a service | Admin |
| PUT | `/api/admin/services/:id` | Update a service | Admin |
| DELETE | `/api/admin/services/:id` | Delete a service | Admin |
| GET | `/api/admin/bookings` | Get bookings for admin's services | Admin |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | JWT expiration (e.g., `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail app password |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | Environment (`development` / `production`) |

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | password123 |
| User | john@test.com | password123 |
