# LDMS Frontend

A React + TypeScript + Vite frontend for a logistics delivery management system. The app supports role-based dashboards for customers, administrators, and delivery agents, including shipment creation, tracking, live monitoring, and profile management.

## Key Features

- Landing page with marketing content and navigation
- Authentication: login, registration, logout, and token refresh
- Protected dashboard experience with role-aware routing
- Customer features:
  - Create new shipments
  - View shipment history
  - Track shipments by ID
  - View notifications and payment success
  - Submit complaints
- Admin features:
  - Register delivery agents
  - Manage agent accounts
  - View all shipments
  - Live shipment tracking
  - Manage complaints
- Agent features:
  - Delivery dashboard
  - Delivery detail view
  - Delivery history
  - Shipment tracking assigned to agents
- Reusable UI components, toast notifications, charts, and responsive layouts

## Tech Stack

- React 19
- TypeScript 6
- Vite
- Redux Toolkit
- React Router DOM 7
- Axios
- Tailwind CSS
- React Toastify
- Recharts
- Framer Motion
- Lucide React
- FontAwesome

## Repository Structure

- `src/main.tsx` — application bootstrap, Redux provider, auth initialization, and Axios store injection
- `src/App.tsx` — root component and toast container
- `src/app/AppRoutes.tsx` — router definitions with public and protected routes
- `src/app/ProtectedRoute.tsx` — guards protected routes until auth is initialized
- `src/app/store.ts` — Redux store configuration
- `src/lib/axios.ts` — Axios instance, auth header injection, refresh token queue handling
- `src/features/auth/` — auth slices, login/register pages, and auth types
- `src/features/customerShipment/` — customer shipment pages, tracking, payments, notifications, complaints
- `src/features/adminShipment/` — admin pages for agents, shipments, live tracking, and complaints
- `src/features/agentShipment/` — delivery agent workflow pages and status management
- `src/staticComponents/` — shared dashboard layout components like sidebar and topbar
- `src/shared/` — reusable UI components, hooks, and utilities

## Setup Instructions

### Requirements

- Node.js 20+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Environment

Create a `.env` or `.env.local` file at the project root with:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Adjust the API base URL to match your backend endpoint.

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Routing Overview

### Public routes

- `/` — Landing page
- `/login` — Login page
- `/register` — Registration page

### Protected routes

- `/adminDashboard`
- `/customerDashboard`
- `/agentDashboard`
- `/profile`
- `/sendShipment`
- `/myShipments`
- `/trackShipments`
- `/trackShipments/:shipmentId`
- `/customerNotifications`
- `/paymentSuccess`
- `/myComplaints`
- `/agentRegisteration`
- `/agentManagement`
- `/allShipment`
- `/liveTracking`
- `/liveTracking/:shipmentId`
- `/adminComplaints`
- `/deliveryDetail`
- `/deliveryHistory`
- `/payments`
- `/agentTracking`
- `/agentTracking/:shipmentId`

## Auth & API Behavior

- The app initializes authentication on startup via `initializeAuth()` in `src/main.tsx`.
- `src/lib/axios.ts` injects the access token from Redux state into request headers.
- `withCredentials: true` is enabled so refresh token cookies are sent automatically.
- If a request receives a `401`, the client attempts a token refresh and retries the request.
- On refresh failure, the user is logged out and redirected to `/login`.

## Development Notes

- Lazy loading is used for page routes to reduce initial bundle size.
- `ProtectedRoute` waits until auth initialization completes before rendering protected content.
- Redux slices are split by domain: `auth`, `shipment`, `admin`, and `agent`.
- Tailwind CSS is configured through `@tailwindcss/vite` in `vite.config.ts`.

## Useful Commands

- `npm run dev` — start local development server
- `npm run build` — compile production bundle
- `npm run preview` — preview built app
- `npm run lint` — run ESLint across the project

## Notes

- The frontend expects a working backend API that supports `/auth/login`, `/auth/register`, `/auth/logout`, and `/auth/refreshToken`.
- The app does not persist authentication tokens in local storage; auth state is stored only in Redux and refreshed through cookies.
- The existing codebase uses role-specific dashboards and guarded client routes to separate customer/admin/agent experiences.

