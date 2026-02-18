# Event Booking Platform — Frontend

A React-based frontend for the Event Booking Platform. Browse event services, book dates, and manage bookings — built with React 19, Tailwind CSS v4, and React Router v7.

## Tech Stack

- **React 19** (via Vite)
- **React Router v7** — client-side routing
- **Axios** — HTTP client with cookie-based auth
- **Tailwind CSS v4** — utility-first styling (CSS-based config)
- **React Hot Toast** — notifications
- **React Icons** — iconography
- **React DatePicker** — date selection
- **date-fns** — date formatting

## Prerequisites

- Node.js 18+
- Backend server running (default: `http://localhost:5000`)

## Setup

```bash
cd client
```

Create `.env`:

```env
VITE_API_TARGET=http://localhost:5000
```

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Authentication

- Uses **httpOnly cookies** — no tokens stored client-side
- `withCredentials: true` is set on all requests via the Axios instance
- Auth state is managed via React Context (`AuthProvider`)

## Seed Credentials

| Role  | Email            | Password    |
|-------|------------------|-------------|
| Admin | admin@test.com   | password123 |
| User  | john@test.com    | password123 |

## Folder Structure

```
src/
├── api/          # Axios instance
├── context/      # AuthContext
├── hooks/        # useAuth
├── layouts/      # MainLayout, AdminLayout
├── components/
│   ├── common/   # Navbar, Footer, Spinner, Pagination, etc.
│   ├── services/ # ServiceCard, ServiceFilters, ServiceGrid
│   ├── booking/  # BookingCard, BookingDatePicker
│   └── admin/    # ServiceForm, AdminServiceCard, etc.
└── pages/        # All route pages
```
