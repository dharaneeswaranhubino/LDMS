# LDMS Frontend

A React + TypeScript + Vite dashboard for a logistics delivery management system. This front-end app provides role-based views for customers, administrators, and delivery agents.

## Features

- Landing page with marketing and navigation sections
- Authentication with login, registration, and refresh-token support
- Protected dashboard layout with role-specific routes
- Customer workflows:
  - Send shipments
  - View shipment history
  - Track shipments
  - Manage profile
- Admin workflows:
  - Register delivery agents
  - Manage agents
  - View all shipments
  - Live tracking dashboard
- Agent workflows:
  - Delivery dashboard
  - Delivery details and status updates
  - Delivery history
- Notification support via `react-toastify`

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router DOM 7
- Axios with automatic auth token refresh
- Tailwind CSS
- React Toastify
- React Select
- Recharts
- Framer Motion
- Lucide React
- FontAwesome

## Project Structure

- `src/App.tsx` — root application component
- `src/app/AppRoutes.tsx` — route definitions and lazy page loading
- `src/app/store.ts` — Redux store configuration
- `src/features/auth/` — authentication pages and state
- `src/features/shipment/` — customer shipment flows
- `src/features/adminShipment/` — admin agent management
- `src/features/agentShipment/` — delivery agent workflows
- `src/staticComponents/` — shared dashboard layout components
- `src/shared/` — reusable UI components and hooks
- `src/lib/axios.ts` — API client with interceptors and token handling

## Setup

Install dependencies:

```bash
npm install
```

Create an environment file named `.env` or `.env.local` with:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Routing Overview

Public routes:

- `/` — Landing page
- `/login` — Login page
- `/register` — Registration page

Protected routes (require authentication):

- `/adminDashboard`
- `/customerDashboard`
- `/agentDashboard`
- `/profile`
- `/sendShipment`
- `/myShipments`
- `/trackShipments`
- `/agentRegisteration`
- `/agentManagement`
- `/allShipment`
- `/liveTracking`
- `/deliveryDetail`
- `/deliveryHistory`

## API Integration

The app uses Axios with `withCredentials: true`, so cookies are sent automatically.

The API client handles:

- attaching `Authorization: Bearer <token>` headers
- refreshing access tokens on 401 responses
- redirecting unauthenticated users to `/login`

## Notes

- Authentication is initialized automatically on page load via `src/features/auth/authSlice.ts`.
- Dashboard content is wrapped in `ProtectedRoute` to ensure only authenticated users can access protected pages.
- Tailwind CSS is configured using the `@tailwindcss/vite` plugin.

