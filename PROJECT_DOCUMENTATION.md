# LDMS Frontend Documentation

## Project Overview

LDMS is a React + TypeScript + Vite frontend for a logistics delivery management system. The application supports role-based experiences for customers, administrators, and delivery agents. It provides shipment creation, tracking, live monitoring, notifications, payments, complaints, and user profile management.

## Tech Stack

- React 19
- TypeScript 6
- Vite
- Redux Toolkit
- React Router DOM 7
- Axios
- Tailwind CSS via `@tailwindcss/vite`
- React Toastify
- Recharts
- Framer Motion
- Lucide React
- FontAwesome

## Project Structure

- `src/main.tsx` — app bootstrap, Redux provider, auth initialization, and Axios store injection.
- `src/App.tsx` — root component with app routes and toast container.
- `src/app/AppRoutes.tsx` — router tree with public and protected routes.
- `src/app/ProtectedRoute.tsx` — guarded route wrapper that blocks access until auth state is initialized.
- `src/app/store.ts` — Redux store configuration with slices for auth, customer shipment, admin, and agent.
- `src/lib/axios.ts` — Axios HTTP client, request interceptor for auth header injection, response interceptor for refresh token retry logic.
- `src/features/auth/` — authentication slice, login page, registration page, and auth types.
- `src/features/customerShipment/` — customer-facing features including shipment creation, shipment list, tracking, notifications, payment workflow, and complaints.
- `src/features/adminShipment/` — admin features for agent registration and management, shipment overview, live tracking, and complaint management.
- `src/features/agentShipment/` — delivery agent workflow, including deliveries list, tracking, status updates, and availability toggling.
- `src/features/dashboard/` — dashboard pages for each user role and associated UI components.
- `src/staticComponents/` — shared dashboard UI elements such as `Sidebar`, `Topbar`, and `DashboardLayout`.
- `src/shared/` — reusable UI components, hooks, and utilities.

## Key Configuration Files

- `package.json`
  - `dev`: `vite`
  - `build`: `tsc -b && vite build`
  - `lint`: `eslint .`
  - `preview`: `vite preview`
- `vite.config.ts`
  - `@vitejs/plugin-react`
  - `@tailwindcss/vite`
- `tsconfig.json`
  - references `tsconfig.app.json` and `tsconfig.node.json`

## Routing and Navigation

### Public Routes

- `/` — Landing page
- `/login` — Login page
- `/register` — Registration page

### Protected Routes

These routes are rendered beneath `DashboardLayout` and require a valid access token:

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

## Authentication Flow

- `src/main.tsx` calls `store.dispatch(initializeAuth())` at startup.
- `src/features/auth/authSlice.ts` defines async thunks:
  - `initializeAuth` — refreshes auth state on app launch via `/auth/refreshToken`.
  - `loginUser` — signs in via `/auth/login`.
  - `registerUser` — creates new user via `/auth/register`.
  - `logoutUser` — ends session via `/auth/logout`.
- Auth state is stored in Redux only; access tokens are not persisted to local storage.
- `src/app/ProtectedRoute.tsx` waits for `isInitialized` before rendering protected routes. If no access token exists, it redirects to `/login`.

## Axios and API Integration

- `src/lib/axios.ts` creates a shared Axios client using `import.meta.env.VITE_API_BASE_URL`.
- Requests send cookies automatically via `withCredentials: true`.
- The request interceptor adds `Authorization: Bearer <token>` when the Redux auth token exists.
- The response interceptor handles `401` failures by retrying using `/auth/refreshToken` and updates Redux state with the new token.
- If refresh fails, the user is logged out and redirected to `/login`.

## Redux Store and State Slices

### Auth Slice

- Stored in `src/features/auth/authSlice.ts`.
- State: `user`, `accessToken`, `loading`, `error`, `isInitialized`.
- Reducers: `setAccessToken`, `setUser`, `logout`.

### Customer Shipment Slice

- Stored in `src/features/customerShipment/shipmentSlice.ts`.
- Features:
  - create/update shipments
  - payment initiation and verification
  - fetching user shipments
  - shipment timeline retrieval
  - notifications fetch/read actions
  - complaint creation and user complaints listing
  - mock customer dashboard data for UI charts
- State includes pagination, notifications, timeline, complaints, and dashboard range filters.
- Contains helper payload mapping logic in `components/createShipmentComponents/shipmentMapper.ts`.

### Admin Slice

- Stored in `src/features/adminShipment/adminSlice.ts`.
- Features:
  - creating delivery agent records
  - listing delivery agents
  - fetching admin dashboard analytics
  - paginated all shipments list
  - fetching and updating complaint statuses
- Includes mock dashboard generation for admin statistics when backend data is unavailable.

### Agent Slice

- Stored in `src/features/agentShipment/agentSlice.ts`.
- Features:
  - fetching the logged-in agent's deliveries
  - updating shipment status
  - toggling agent availability
  - search/filter state and timeline clearing
- State contains deliveries, availability, loading flags, and timeline state.

## Feature Summaries

### Landing Page

- `src/features/landingPage/pages/LandingPage.tsx`
- Uses page sections: Navbar, Hero, Stats, Services, CTA, Footer.
- Includes responsive mobile menu and scroll tracking.

### Authentication Pages

- `src/features/auth/pages/Login.tsx`
  - validates credentials locally
  - dispatches `loginUser`
  - redirects based on `user.role` after login
- `src/features/auth/pages/Register.tsx`
  - validates registration fields and password confirmation
  - dispatches `registerUser`
  - displays a success page before redirecting to `/login`

### Profile

- `src/features/profile/pages/ProfilePage.tsx`
- Displays current user details and role
- Uses `ProfileView` component for presentation
- Has placeholders for future profile editing

### Customer Experience

- `CreateShipment` — multi-step shipment creation flow with animated transitions and price breakdown
- `MyShipments` — shipment list with filters, search, sort, pagination, flight detail modal, and payment view modal
- `TrackShipment` — shipment lookup with timeline presentation
- `CustomerNotifications` — notification list with read/unread handling
- `PaymentDetails` — payment detail retrieval and display
- `MyComplaints` — complaint history and status filtering

### Admin Experience

- `AdminDashboard` — dashboard analytics, revenue charts, payment summary, agent performance, recent shipments, complaint summary
- `CreateAgent` — agent registration form for admin users
- `AgentManagement` — list and manage delivery agents
- `Adminallshipments` — paginated all shipments list
- `AdminLiveTracking` — live shipment search, active shipment list, and timeline panel for admin tracking
- `AdminComplaints` — complaint table and detail management

### Agent Experience

- `AgentDashboard` — availability toggle, active deliveries, schedule, customer messages, and completed deliveries summary
- `DeliveryDetail` — delivery detail screen for a selected shipment
- `DeliveryHistory` — agent delivery history listing
- `AgentTracking` — agent-specific shipment tracking and timeline display

## Shared UI and Utilities

- `src/staticComponents/Sidebar.tsx` — left navigation menu with role-aware route filtering and badge counts.
- `src/staticComponents/Topbar.tsx` — application header with notification dropdown and profile menu.
- `src/staticComponents/DashboardLayout.tsx` — common dashboard wrapper containing `Topbar`, `Sidebar`, and `Outlet`.
- `src/shared/components/` — reusable UI controls including:
  - `Button`
  - `Input`
  - `Pagination`
  - `LoadingSpinner`
  - `Toast`
  - `DonutChart`
  - `LineChart`
  - `DateRangePicker`
- `src/shared/hooks/reduxHooks.ts` — typed `useAppDispatch` and `useAppSelector`.
- `src/shared/hooks/useRole.ts` — role helper for access control.

## API Endpoint Usage

The frontend communicates with the backend through these routes, driven by `src/lib/axios.ts`:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `POST /auth/refreshToken`
- `POST /shipments`
- `PATCH /shipments/:shipmentId`
- `GET /shipments/myShipments`
- `GET /shipments/:id`
- `GET /shipments/:shipmentId/timeline`
- `POST /payments/initiate/:shipmentId`
- `POST /payments/verify/:shipmentId`
- `GET /payments/:shipmentId`
- `GET /notifications/me`
- `PATCH /notifications/readAll`
- `PATCH /notifications/read/:notificationId`
- `POST /complaints/:shipmentId`
- `GET /complaints/me`
- `POST /deliveryAgents`
- `GET /deliveryAgents`
- `GET /dashboard/admin`
- `GET /shipments`
- `GET /complaints`
- `PATCH /complaints/:complaintId`
- `GET /shipments/myDeliveries`
- `PATCH /shipments/status/:id`
- `PATCH /deliveryAgents/myAvailability`

## Setup

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

Adjust the API base URL to match the backend host.

### Run locally

```bash
npm run dev
```

### Build production bundle

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Notes and Observations

- Role-based UI and routing are implemented but the backend role enforcement is expected to align with frontend roles.
- Customer and admin dashboards use mock or generated dashboard data if backend responses are unavailable.
- Auth refresh uses cookies and does not persist tokens outside Redux state.
- Some profile update logic is commented out and left for future implementation.
- Notification dropdown and role-specific menu items are built into the shared layout.

## Recommended Next Steps

- Confirm backend API contract for all listed endpoints.
- Add backend-driven dashboard data for customer and admin tiles.
- Implement profile update functionality.
- Validate role-based route protection server-side in addition to frontend guards.
- Add tests for Redux slices and route protection.
