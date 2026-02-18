

---

# PROJECT: Event Booking Platform — Frontend (React)

Build the complete frontend for an event booking platform. The backend is already built and running inside this monorepo under `/server`.

**Examine the backend source code** — routes, controllers, models, and middleware — to understand all API endpoints, their request/response shapes, validation rules, and data models. Do not guess — read the code.

This prompt specifies frontend architecture, page behavior, and component design. It does NOT duplicate backend documentation. When you need to know what an endpoint returns, look at the backend code.

---

## KEY BACKEND BEHAVIOR

- The backend runs at a configurable URL (default `http://localhost:5000` in development). All API routes are prefixed with `/api`.
- Auth uses **httpOnly cookies** — the browser sends them automatically. Do NOT store tokens anywhere. Do NOT set Authorization headers.
- `withCredentials: true` is **mandatory** on every request so the browser includes the cookie.
- CORS is pre-configured on the backend for `http://localhost:5173`.
- Error responses follow the shape `{ success: false, error: "message" }` or `{ success: false, errors: ["msg1", "msg2"] }`.
- Image uploads use `multipart/form-data`. The field name for images is `images` (max 5 files). Do NOT set the Content-Type header manually — let the browser set the multipart boundary.

### Quick-Reference Enums (also defined in the backend models)
- **Categories:** `venue`, `hotel`, `caterer`, `cameraman`, `dj`, `decorator`, `other`
- **Booking statuses:** `confirmed`, `cancelled`
- **User roles:** `user`, `admin`

### Seed Credentials
| Role  | Email            | Password    |
|-------|------------------|-------------|
| Admin | admin@test.com   | password123 |
| User  | john@test.com    | password123 |

---

## TECH STACK

- **React 19** (via Vite)
- **React Router v7** (`react-router-dom`) for client-side routing
- **Axios** for HTTP requests (configured with `withCredentials: true`)
- **Tailwind CSS v4** for styling (CSS-based configuration via `@theme` — NO `tailwind.config.js`)
- **React Hot Toast** (`react-hot-toast`) for toast notifications
- **React Icons** (`react-icons`) for icons throughout the UI
- **React DatePicker** (`react-datepicker`) for date selection in booking and service forms
- **date-fns** for date formatting/manipulation
- **React Context API** for global auth state (no Redux)

---

## MONOREPO STRUCTURE

This is the `/client` folder inside a monorepo root (sibling to `/server`).

```
client/
├── .env                               # Environment variables (VITE_API_TARGET)
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── axios.js                   # Axios instance: baseURL '/api', withCredentials
│   ├── context/
│   │   └── AuthContext.jsx            # Auth context: user state, login, register, logout, loading
│   ├── hooks/
│   │   └── useAuth.js                 # Custom hook to consume AuthContext
│   ├── layouts/
│   │   ├── MainLayout.jsx            # Navbar + Footer + <Outlet />
│   │   └── AdminLayout.jsx           # Admin sidebar/nav + <Outlet />
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── ConfirmModal.jsx       # Reusable confirmation modal (replaces window.confirm)
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── Pagination.jsx
│   │   ├── services/
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── ServiceFilters.jsx
│   │   │   └── ServiceGrid.jsx
│   │   ├── booking/
│   │   │   ├── BookingCard.jsx
│   │   │   └── BookingDatePicker.jsx
│   │   └── admin/
│   │       ├── ServiceForm.jsx
│   │       ├── AdminServiceCard.jsx
│   │       ├── AdminBookingTable.jsx
│   │       └── DashboardStats.jsx     # Stat cards for admin dashboard
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── ServiceDetailPage.jsx
│   │   ├── MyBookingsPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminCreateServicePage.jsx
│   │   │   ├── AdminEditServicePage.jsx
│   │   │   └── AdminBookingsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                      # Tailwind v4 imports + @theme customization
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

**Note:** There is NO `tailwind.config.js` and NO `postcss.config.js`. Tailwind CSS v4 uses the Vite plugin and CSS-based configuration.

---

## CONFIGURATION FILES

### Environment Variables (`.env`)

```env
VITE_API_TARGET=http://localhost:5000
```

This keeps the backend URL configurable across environments (dev, staging, production). Never hardcode `localhost:5000` anywhere else.

### Vite Config (`vite.config.js`)

```js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
```

The Vite dev server proxies all `/api/*` requests to the backend. This means:
- Axios uses `baseURL: '/api'` (relative, no hardcoded host).
- No cross-origin issues during development.
- For production, configure a reverse proxy (Nginx, etc.) to forward `/api` to the backend.

### CSS (`src/index.css`)

```css
@import "tailwindcss";

@theme {
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-300: #a5b4fc;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-800: #3730a3;
  --color-primary-900: #312e81;
  --color-primary-950: #1e1b4b;
}
```

This gives you utility classes like `bg-primary-600`, `text-primary-700`, `ring-primary-500`, etc.

---

## AXIOS SETUP (`src/api/axios.js`)

```js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default API;
```

- `baseURL: '/api'` — requests go to the Vite dev server, which proxies them to the backend.
- `withCredentials: true` — **CRITICAL**. Sends the httpOnly cookie with every request.
- Add a response interceptor: if any response returns 401 and the user is not on `/login` or `/register`, clear auth state and redirect to login.
- Do NOT set Authorization headers or store tokens anywhere.

---

## AUTH CONTEXT (`src/context/AuthContext.jsx`)

Create an AuthContext with AuthProvider component.

### State:
- `user` — null or `{ id, name, email, role }` object
- `loading` — boolean, true while checking auth status on app load

### Functions exposed via context:
- `login(email, password)` — calls `POST /auth/login`, sets user state, shows success toast
- `register(name, email, password, role)` — calls `POST /auth/register`, sets user state, shows success toast
- `logout()` — calls `POST /auth/logout`, clears user state, shows toast, navigates to home
- `checkAuth()` — calls `GET /auth/me`, sets user if valid, sets loading to false. Called once on mount.

### Behavior:
- On AuthProvider mount, call `checkAuth()`. While `loading` is true, show a full-screen spinner — don't render routes yet.
- On login/register success, navigate to the page the user was trying to access (from `location.state?.from`) or `/`.
- On login/register failure, show error toast with the API error message.
- On logout, clear user state and navigate to `/`.

### Custom Hook (`src/hooks/useAuth.js`):
```js
export const useAuth = () => useContext(AuthContext);
```

---

## ROUTE PROTECTION

### ProtectedRoute.jsx
- If `user` is null, redirect to `/login` with `state={{ from: location }}` so the user is redirected back after login.
- Otherwise, render `<Outlet />`.

### AdminRoute.jsx
- If `user` is null, redirect to `/login`.
- If `user.role !== 'admin'`, redirect to `/` and show "Access denied" toast.
- Otherwise, render `<Outlet />`.

---

## ROUTING STRUCTURE (`App.jsx`)

```
/                          → HomePage              (MainLayout, public)
/login                     → LoginPage             (MainLayout, public, redirect if logged in)
/register                  → RegisterPage          (MainLayout, public, redirect if logged in)
/services                  → ServicesPage           (MainLayout, public)
/services/:id              → ServiceDetailPage      (MainLayout, public)
/bookings                  → MyBookingsPage         (MainLayout, ProtectedRoute)
/admin                     → AdminDashboardPage     (AdminLayout, AdminRoute)
/admin/services/create     → AdminCreateServicePage (AdminLayout, AdminRoute)
/admin/services/:id/edit   → AdminEditServicePage   (AdminLayout, AdminRoute)
/admin/bookings            → AdminBookingsPage      (AdminLayout, AdminRoute)
*                          → NotFoundPage           (MainLayout)
```

Use React Router v7 with nested routes and layout components.

---

## PAGE SPECIFICATIONS

### HomePage.jsx

**Sections:**

1. **Hero Section:**
   - Large background gradient or image.
   - Heading: "Find & Book the Perfect Services for Your Event"
   - Subheading: "Venues, Hotels, Caterers, DJs, Decorators & more — all in one place"
   - Search bar: keyword input + "Search" button → navigates to `/services?keyword=<value>`.
   - "Browse All Services" button → `/services`.

2. **Category Highlights:**
   - Display the 7 categories as clickable cards with icons (from react-icons) and capitalized names.
   - Clicking a category navigates to `/services?category=<value>`.

3. **Featured Services:**
   - Fetch latest 6 services: `GET /api/services?limit=6&sort=-createdAt`.
   - Display in responsive grid using `ServiceCard` components.
   - "View All Services" link below.

4. **How It Works:**
   - 3-step section: "Search Services" → "Pick Your Dates" → "Book Instantly" with icons and short descriptions.

5. **Call to Action:**
   - "Are you a service provider?" section encouraging admin registration → `/register`.

---

### LoginPage.jsx

**Fields:** Email, Password

**Behavior:**
- Call `login()` from AuthContext on submit.
- Show loading state on button while pending.
- On success: toast + navigate to `location.state?.from` or `/`.
- On error: toast the API error message.
- Link: "Don't have an account? Register"
- If already logged in, redirect to `/`.

**Client-side validation:**
- Email: required, valid format.
- Password: required, min 6 chars.
- Inline error messages below each field.

---

### RegisterPage.jsx

**Fields:** Name, Email, Password, Confirm Password (client-side only), Role (radio: "User" or "Service Provider (Admin)", default "user")

**Behavior:**
- Validate confirm password matches.
- Call `register()` from AuthContext.
- On success: toast + navigate to `/`.
- On error: display API error.
- Link: "Already have an account? Login"
- If already logged in, redirect to `/`.

**Client-side validation:**
- Name: required, min 2 chars.
- Email: required, valid format.
- Password: required, min 6 chars.
- Confirm password: must match.

---

### ServicesPage.jsx

**Layout:** Two-column on desktop — filters sidebar (left), service grid (right). Collapsible filter panel on mobile.

**Filter Controls (ServiceFilters component):**
- **Keyword:** Text input, debounced 500ms.
- **Category:** Select dropdown (All + 7 categories).
- **Location:** Text input.
- **Price Range:** Min/Max number inputs.
- **Availability Date:** Single date picker.
- **Sort:** Dropdown — "Newest First" (`-createdAt`), "Oldest First" (`createdAt`), "Price: Low to High" (`pricePerDay`), "Price: High to Low" (`-pricePerDay`), "Title: A-Z" (`title`).
- **Clear Filters** button.

**All filter values sync with URL search params** (`useSearchParams`) so the page is bookmarkable, shareable, and browser navigation works.

**Service Grid:**
- Responsive grid (1 col mobile, 2 tablet, 3 desktop) of `ServiceCard` components.
- Show skeleton/spinner while loading. "No services found" message with filter suggestions if empty.

**Pagination:**
- `Pagination` component below grid. Updates `page` URL param on click. Scroll to top on page change.

**Data Fetching:**
- `useEffect` triggered on URL param changes. Read all filters from URL, call `GET /api/services?...`, update local state.

---

### ServiceCard.jsx

**Displays:**
- First image (or placeholder).
- Category badge (different color per category).
- Title (truncated if long).
- Location with map pin icon.
- Price: `₹{pricePerDay.toLocaleString('en-IN')}/day`.
- Available dates count.
- Service provider name (`admin.name`).
- "View Details" link → `/services/:id`.

**Styling:** Rounded corners, shadow, hover lift effect. Image at top with `object-cover`.

---

### ServiceDetailPage.jsx

**Data Fetching:** Get `id` from `useParams`, fetch `GET /api/services/:id`. Show spinner while loading. If not found, show message with link back.

**Left/Top — Service Info:**
- **Image Gallery:** Carousel or main image + thumbnails. Placeholder if no images.
- Title, Category badge, Price (`₹{pricePerDay} per day`), Location, "Listed by {admin.name}".
- Description (preserve line breaks).
- Contact details.
- **Availability Calendar:** Use `react-datepicker` inline (read-only/display) with available dates highlighted. Unavailable dates greyed out.

**Right/Bottom — Booking Panel:**
- If not logged in: "Please log in to book" with login link (pass current URL as redirect state).
- If logged in, show **BookingDatePicker**:
  - Start Date and End Date pickers using `react-datepicker` with `includeDates` set to the service's `availabilityDates`.
  - End date: only allow dates >= start date that form a **continuous range** from start date within `availabilityDates`. Compute the maximum contiguous range from the selected start date and restrict end date selection to that range.
  - When both selected, show: Start Date, End Date, Total Days (endDate - startDate + 1), Total Price (days × pricePerDay formatted).
  - "Confirm Booking" button → `POST /api/bookings` with `{ serviceId, startDate, endDate }`.
  - On success: toast "Booking confirmed!" → navigate to `/bookings`.
  - On error: toast error. Loading state on button while submitting.

---

### MyBookingsPage.jsx

**Data Fetching:** `GET /api/bookings` on mount.

**Layout:**
- Title: "My Bookings"
- Empty state: "You haven't made any bookings yet" + link to browse services.
- List of `BookingCard` components, sorted newest first.
- Optional tabs: "All", "Confirmed", "Cancelled" for client-side filtering.

---

### BookingCard.jsx

**Displays:**
- Service image (first, or placeholder), title (links to `/services/:id`), category badge, location.
- Booking dates formatted: "Jul 1, 2025 — Jul 5, 2025" (use date-fns).
- Total days, total price.
- Status badge: confirmed = green, cancelled = red.
- Booked on: formatted `createdAt`.
- **Cancel Button:** Only shown if status is `confirmed`. Opens `ConfirmModal` with "Are you sure you want to cancel this booking?". On confirm → `PATCH /api/bookings/:id/cancel` → toast + update local state.

---

### AdminDashboardPage.jsx

**Purpose:** Admin overview — stats, recent bookings, and services list.

**Data Fetching:**
- Call `GET /api/admin/dashboard` on mount. This endpoint returns:
  - `stats` — totalServices, totalBookings, confirmedBookings, cancelledBookings, totalRevenue
  - `services` — array of admin's services
  - `recentBookings` — last 5 bookings with populated user and service

**Layout:**

1. **Stats Row (`DashboardStats` component):**
   - Cards showing: Total Services, Total Bookings, Confirmed Bookings, Cancelled Bookings, Total Revenue (₹ formatted).

2. **Recent Bookings Section:**
   - Table or card list of the 5 most recent bookings (customer name, service title, dates, status, amount).
   - "View All Bookings" link → `/admin/bookings`.

3. **My Services Section:**
   - "Create New Service" button → `/admin/services/create`.
   - Grid of `AdminServiceCard` components showing admin's services.
   - Empty state: "You haven't created any services yet" with create button.

---

### AdminServiceCard.jsx

**Displays:**
- Service image (first or placeholder), title, category, price, location.
- Available dates count, created date.
- **Actions:**
  - "Edit" → `/admin/services/:id/edit`.
  - "Delete" → opens `ConfirmModal` → `DELETE /api/admin/services/:id` → toast + remove from list.

---

### AdminCreateServicePage.jsx

Uses `ServiceForm` in create mode (no initial data).

**On submit:**
- Build `FormData`:
  - Text fields: `title`, `category`, `pricePerDay`, `description`, `contactDetails`, `location`.
  - `availabilityDates`: `JSON.stringify(arrayOfYYYY-MM-DDstrings)`.
  - Images: `formData.append('images', file)` for each file.
- Call `POST /api/admin/services` with FormData. Do NOT set Content-Type header.
- On success: toast → navigate to `/admin`.

---

### AdminEditServicePage.jsx

**Data Fetching:** Get `id` from `useParams`, fetch `GET /api/services/:id`. Verify `service.admin._id === user.id` — if not, redirect to `/admin` with "Not authorized" toast.

Uses `ServiceForm` in edit mode (pass fetched service as `initialData`).

**On submit:**
- Build FormData. If new images selected, append them (replaces existing). If not, omit `images` field (backend keeps existing).
- Call `PUT /api/admin/services/:id`.
- On success: toast → navigate to `/admin`.

---

### ServiceForm.jsx (Reusable)

**Props:**
- `initialData` — null (create) or service object (edit)
- `onSubmit(formData)` — callback
- `loading` — boolean

**Fields:**
- **Title:** Text, required.
- **Category:** Select (7 options), required.
- **Price Per Day:** Number, required, min 0.
- **Description:** Textarea, required.
- **Location:** Text, required.
- **Contact Details:** Text, required.
- **Availability Dates:**
  - Use `react-datepicker` with the **`selectsMultiple`** prop to allow selecting **multiple individual (non-contiguous) dates** by clicking on the calendar.
  - `onChange` receives the array of selected Date objects.
  - Disable past dates (`minDate={new Date()}`).
  - Display selected dates as removable chips/tags below the picker.
  - In edit mode, pre-populate from existing `availabilityDates`.
  - **Do NOT use `selectsRange`** — that only selects contiguous ranges, not arbitrary individual dates.
- **Images:**
  - File input, multiple, max 5. Accept `image/*`.
  - Show preview thumbnails.
  - In edit mode: show existing images. If new files selected, show those with note "New images will replace existing ones".

**Client-side validation:**
- All required fields filled.
- Price is a positive number.
- At least one availability date selected.
- Max 5 images.
- Inline error messages.

---

### AdminBookingsPage.jsx

**Data Fetching:** `GET /api/admin/bookings` on mount.

**Layout:**
- Title: "Bookings on My Services".
- Empty state if none.
- `AdminBookingTable` on desktop, cards on mobile.
- Columns: Service Title, Category, Customer Name, Email, Dates, Total Days, Price, Status (badge), Booked On.
- Sorted newest first. Optional client-side status/service filter.

---

### NotFoundPage.jsx
- "404 — Page Not Found" with illustration/icon.
- "Go Home" button → `/`.

---

## COMPONENT SPECIFICATIONS

### ConfirmModal.jsx

**Props:**
- `isOpen` (boolean)
- `title` (string)
- `message` (string)
- `onConfirm` (function)
- `onCancel` (function)
- `confirmText` (string, default "Confirm")
- `cancelText` (string, default "Cancel")
- `variant` ("danger" | "warning", default "danger")

**Behavior:**
- Renders a centered modal with backdrop overlay when `isOpen` is true.
- Shows title, message, Cancel button, and Confirm button (styled by variant — red for danger).
- Clicking backdrop or Cancel calls `onCancel`.
- Pressing Escape key calls `onCancel`.
- Focus trapped within modal while open.
- Use this everywhere instead of `window.confirm()` — booking cancellation, service deletion, etc.

### Navbar.jsx
- Brand name/logo → `/`.
- Links: "Services" (always), "My Bookings" (logged in), "Admin Dashboard" (admin only).
- Right side: Login/Register buttons (logged out) or user name + role badge + Logout button (logged in).
- Mobile: hamburger menu with drawer/dropdown.
- Sticky at top.

### Footer.jsx
- Brand name, copyright year, links to Services/Login/Register.

### Spinner.jsx
- Centered spinner (Tailwind `animate-spin`). Accepts `size` prop (sm/md/lg).
- Used for full-page loading and inline loading.

### Pagination.jsx
**Props:** `currentPage`, `totalPages`, `onPageChange(page)`
- Previous/Next buttons (disabled at boundaries).
- Page numbers with ellipsis for large ranges (show ~5 pages around current).

### DashboardStats.jsx
**Props:** `stats` object from dashboard endpoint.
- Row of stat cards: Total Services, Total Bookings, Confirmed, Cancelled, Revenue.
- Each card has an icon, label, and value. Revenue formatted with ₹.

---

## LAYOUTS

### MainLayout.jsx
```jsx
<div className="min-h-screen flex flex-col">
  <Navbar />
  <main className="flex-grow">
    <Outlet />
  </main>
  <Footer />
</div>
```

### AdminLayout.jsx
- Navbar at top.
- Sidebar (left): "Dashboard" → `/admin`, "Create Service" → `/admin/services/create`, "Bookings" → `/admin/bookings`, "Back to Site" → `/`.
- Content area (right): `<Outlet />`.
- Mobile: sidebar collapses into toggle menu.

---

## STYLING & DESIGN GUIDELINES

### Design System
- **Primary color:** Indigo-600 (`#4F46E5`), configured as `primary` via `@theme` in `index.css`. Use `bg-primary-600`, `hover:bg-primary-700`, etc.
- **Background:** White / gray-50 for pages, white for cards.
- **Text:** Gray-900 headings, gray-600 body.
- **Cards:** White, `rounded-lg`, `shadow-md`, padded.
- **Buttons:**
  - Primary: `bg-primary-600 text-white hover:bg-primary-700 rounded-lg px-4 py-2`
  - Secondary: `border border-gray-300 text-gray-700 hover:bg-gray-50`
  - Danger: `bg-red-600 text-white` (delete/cancel actions)
  - Disabled: `opacity-50 cursor-not-allowed`
- **Badges:** `rounded-full`, small text, colored by type:
  - Category colors: venue=purple, hotel=blue, caterer=orange, cameraman=cyan, dj=pink, decorator=green, other=gray.
  - Status: confirmed=green, cancelled=red.
- **Form inputs:** `border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
- **Responsive:** Mobile-first. Everything works at 320px+.
- **Transitions:** `transition-all duration-200` on hover states.

### Toast Notifications
- `react-hot-toast`, `<Toaster />` in `App.jsx` or `main.jsx`.
- Position: top-right. Success: 3s. Error: 4s.

---

## STATE MANAGEMENT PATTERNS

### Global State (Context)
- Auth only: user, loading, login/register/logout.

### Local State (per page)
- `useState` for data, loading, errors.
- `useEffect` for fetching on mount / dependency changes.
- `useSearchParams` for filters/pagination on ServicesPage.

### Loading & Error States
- **Every data-fetching page** handles: Loading (spinner), Error (message + retry), Success (render data).
- Form submissions: disable button + show spinner inside it.

---

## DATE HANDLING

- API communication: ISO strings (`YYYY-MM-DD`).
- Display formatting: `format(new Date(dateString), 'MMM d, yyyy')` → "Jul 1, 2025" (date-fns).
- Date ranges: "Jul 1 — Jul 5, 2025".
- `availabilityDates` from API are ISO strings like `"2025-07-01T00:00:00.000Z"` — parse to Date objects for pickers.
- For ServiceForm's multi-date picker, store as Date array, stringify to `["2025-07-01", "2025-07-02", ...]` on submit.

---

## ERROR HANDLING PATTERNS

```js
// Extract error message from API response
const message = error.response?.data?.error
  || error.response?.data?.errors?.join(', ')
  || 'Something went wrong';
toast.error(message);
```

- **401 responses:** Clear user from AuthContext, redirect to login. Handle in axios response interceptor.
- **Network errors (no response):** Show "Network error — please try again later."

---

## IMPORTANT RULES

1. **`withCredentials: true`** on every request. httpOnly cookie is the only auth mechanism. No localStorage, no tokens, no Authorization headers.
2. **All API calls** go through the shared axios instance (`src/api/axios.js`).
3. **All routes** wrapped with appropriate protection (ProtectedRoute, AdminRoute).
4. **URL search params for filters** on ServicesPage for bookmarkability and browser nav.
5. **Responsive** — works on mobile (320px+), tablet, desktop.
6. **No UI libraries** — Tailwind utility classes only. Build all components from scratch.
7. **Client-side validation** before submitting. Inline errors under fields. Also handle server errors.
8. **Image uploads** via FormData. Do NOT set Content-Type header.
9. **Date normalization** — parse for pickers, format for display with date-fns.
10. **Toast on every action** — login, register, logout, booking, cancel, CRUD, all errors.
11. **Loading states everywhere** — spinner during every fetch. Never a blank page.
12. **Accessibility basics** — semantic HTML, labels, alt text, keyboard nav.
13. **Price formatting:** `₹${price.toLocaleString('en-IN')}` → ₹25,000.
14. **Empty states** — every list/grid page handles zero data with helpful message + suggested action.
15. **`ConfirmModal` for destructive actions** — delete service, cancel booking. Never use `window.confirm()`.
16. **Clean up** — cancel pending requests or ignore stale responses on unmount (AbortController or mounted check).
17. **No hardcoded URLs** — the backend address is only in `.env` and used by the Vite proxy config. Axios uses `/api` only.

---

## DEPENDENCIES

```bash
npm create vite@latest client -- --template react
cd client
npm install react-router-dom axios react-hot-toast react-icons react-datepicker date-fns
npm install -D tailwindcss @tailwindcss/vite
```

---

## PACKAGE.JSON SCRIPTS

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## README.md

Include:
- Project title: "Event Booking Platform — Frontend"
- Description
- Tech stack list
- Prerequisites: Node.js, backend server running
- Setup: `cd client` → create `.env` with `VITE_API_TARGET=http://localhost:5000` → `npm install` → `npm run dev`
- Available scripts
- Folder structure overview
- Auth mechanism note (httpOnly cookies, withCredentials)
- Seed credentials

---

## BUILD ORDER

Build all files. Start with: `.env` → `vite.config.js` → `index.css` → `src/api/axios.js` → context → hooks → components (common → services → booking → admin) → layouts → pages (public → protected → admin) → `App.jsx` → `main.jsx` → `package.json` → `README.md`.