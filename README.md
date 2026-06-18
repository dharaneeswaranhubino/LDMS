LDMS Frontend - Logistics & Delivery Management System

A modern, full-featured React + TypeScript SaaS platform for comprehensive logistics and delivery management. The application provides role-based experiences for customers, administrators, and delivery agents with real-time shipment tracking, payment processing, and multi-channel communication.

---

Table of Contents

Project Overview
Key Features
Tech Stack
Project Architecture
Authentication & Security
API Endpoints
Project Structure
Setup Instructions
Development Workflow
Routing Overview
State Management
Third-Party Integrations
Contributing Guidelines
Troubleshooting

---

Project Overview

LDMS is a comprehensive Logistics and Delivery Management System built for modern e-commerce and logistics businesses. The platform enables:

Shipment Management: Create, monitor, and track shipments end-to-end
Live Delivery Tracking: Real-time location tracking with timeline visualization
Multi-Role Platform: Separate dashboards and workflows for customers, admins, and agents
Payment Integration: Razorpay payment gateway for seamless transactions
Notifications System: Real-time alerts and in-app notifications
Agent Management: Complete lifecycle management for delivery agents
Complaint Management: Structured complaint filing and resolution workflows

Use Cases

Customers create shipments, track deliveries, manage payments, and file complaints
Admins manage delivery agents, monitor all shipments, handle disputes, and view analytics
Delivery Agents manage assigned deliveries, update statuses, and track performance

---

Key Features

Customer Features

- Create Shipments: Multi-step form with validation for creating new shipments
- Track Shipments: Real-time tracking by shipment ID with timeline and status updates
- Shipment History: Paginated list view with search and filtering capabilities
- Online Payments: Razorpay integration for secure payment processing
- Notifications: In-app notification center with read/unread status management
- File Complaints: Submit complaints against shipments and track resolution status
- View Profile: Personal profile management and information display

Admin Features

- Register Agents: Form-based agent registration with validation
- Agent Management: List, view, and update delivery agent accounts
- View All Shipments: Paginated dashboard of all shipments in the system
- Live Tracking: Real-time tracking of specific shipments
- Complaint Management: View and update status of customer complaints
- Dashboard Analytics: Revenue metrics, shipment counts, agent performance
- Performance Metrics: Monitor system health and KPIs

Delivery Agent Features

- Delivery Dashboard: Overview of assigned deliveries and pending tasks
- Manage Deliveries: Accept, manage, and complete assigned deliveries
- Update Status: Mark deliveries as picked up, out for delivery, or delivered
- Track Deliveries: View detailed information for each assigned shipment
- Delivery History: Historical record of completed deliveries
- Availability Toggle: Set online/offline status for availability
- Live Tracking: Track shipments assigned to agent

---

Tech Stack

Core Framework

- React (19.2.5): UI library
- React DOM (19.2.5): DOM rendering
- TypeScript (6.0): Type-safe development
- Vite (8.0): Build tool & dev server

State Management & Routing

- Redux Toolkit (2.11.2): Centralized state management
- React Redux (9.2.0): React bindings for Redux
- Redux Persist (6.0.0): State persistence layer
- React Router DOM (7.15.0): Client-side routing with new features

HTTP & API

- Axios (1.16.0): HTTP client with interceptors
- Socket.io Client (4.8.3): Real-time communication
- JWT Decode (4.0.0): JWT token parsing

UI & Styling

- Tailwind CSS (4.2.4): Utility-first CSS framework
- Lucide React (1.14.0): Modern icon library
- React Icons (5.6.0): Icon collection
- FontAwesome (7.2.0): Enterprise icons
- Framer Motion (12.38.0): Animation library

Data Visualization & Utilities

- Recharts (3.8.1): Chart components (line, donut)
- Chart.js (4.5.1): Alternative charting library
- React Toastify (11.1.0): Toast notifications
- React Select (5.10.2): Custom dropdown components
- HTML2Canvas (1.4.1): Screenshot generation
- jsPDF (4.2.1): PDF generation
- React PDF Renderer (4.5.1): PDF rendering
- Canvas Confetti (1.9.4): Celebration animations
- Use Sound (5.0.0): Audio playback

Development Tools

- ESLint (10.2.1): Code linting
- Vite React Plugin (6.0.1): React integration for Vite

---

Project Architecture

Architecture Diagram

LDMS Frontend App consists of the following layers:

React Router (v7)
- Public Routes: /, /login, /register
- Protected Routes: */Dashboard, /profile, etc.

Redux Store (Centralized State)
- auth: User, tokens, auth status
- shipment: Customer shipments, notifications
- admin: Agents, all shipments, complaints
- agent: Deliveries, availability

Axios (HTTP Client with Interceptors)
- Auth header injection (Bearer token)
- Automatic token refresh on 401
- Cookie-based refresh token handling

Backend API (Render.com Cloud Deployment)
- https://logisticsanddeliverymanagementsystem.onrender.com/api/v1/
- /auth/* (Login, Register, Token Refresh)
- /shipments/* (CRUD, tracking, status)
- /payments/* (Razorpay integration)
- /notifications/* (Real-time alerts)
- /complaints/* (Issue management)
- /deliveryAgents/* (Agent lifecycle)

External Services Integration
- Razorpay (Payment processing)
- Socket.io (Real-time updates)
- File Storage (Images, documents)

Component Hierarchy
```
App (Root)
├── ToastContainer (Notifications)
├── Router
│   ├── Public Routes
│   │   ├── Landing Page
│   │   ├── Login
│   │   └── Register
│   └── Protected Routes (Auth Required)
│       ├── ProtectedRoute (Auth Check)
│       ├── DashboardLayout (Sidebar + Topbar)
│       │   ├── Customer Dashboard
│       │   ├── Admin Dashboard
│       │   └── Agent Dashboard
│       ├── Feature Routes
│       │   ├── Shipment Management
│       │   ├── Payment Processing
│       │   ├── Complaint Management
│       │   ├── Agent Management
│       │   └── Live Tracking
│       └── Profile Page
```

---

Authentication & Security

Authentication Flow

```
┌─ App Start ─────────────────────────┐
│ initializeAuth() called in main.tsx │
└──────────────┬──────────────────────┘
               ↓
        ┌─ POST /auth/refreshToken ──┐
        │ (with httpOnly cookies)     │
        └──────┬───────────┬──────────┘
               ↓           ↓
            Success     Failure
               ↓           ↓
        Update Token  Redirect to /login
        Load User
        Set Flag
```

Token Management

Access Token: Short-lived JWT, stored in Redux state, injected in request headers
Refresh Token: Long-lived token, stored in httpOnly cookies (secure, auto-sent)
Token Refresh: Automatic retry queue on 401 responses
Local Storage: NOT used (all state in Redux for security)

Auth State Structure

```typescript
{
  user: {
    id: string
    name: string
    email: string
    role: 'customer' | 'admin' | 'deliveryAgent'
    profilePicture?: string
  }
  accessToken: string | null
  loading: boolean
  error: string | null
  isInitialized: boolean
}
```

Security Features

HTTPS Only: Production uses HTTPS
httpOnly Cookies: Refresh tokens immune to XSS
Bearer Tokens: Access tokens in Authorization header
CORS Enabled: Proper cross-origin handling
Automatic Logout: On refresh failure
Protected Routes: Auth guard on all private routes  

---

API Endpoints

Base URL
```
https://logisticsanddeliverymanagementsystem.onrender.com/api/v1/
```

Authentication Endpoints

- POST /auth/login: User login with email & password
- POST /auth/register: New user registration
- POST /auth/logout: Logout and invalidate tokens
- POST /auth/refreshToken: Refresh access token using cookie

Shipment Endpoints

- POST /shipments: Create new shipment
- GET /shipments: Fetch all shipments (admin only)
- GET /shipments/myShipments: Fetch user's shipments
- GET /shipments/:id: Get single shipment details
- GET /shipments/:id/timeline: Get shipment timeline/status history
- PATCH /shipments/:id: Update shipment details
- PATCH /shipments/status/:id: Update shipment status (agent)
- GET /shipments/myDeliveries: Get agent's assigned deliveries

Payment Endpoints

- POST /payments/initiate/:shipmentId: Create Razorpay order
- POST /payments/verify/:shipmentId: Verify payment signature
- GET /payments/:shipmentId: Get payment details

Notification Endpoints

- GET /notifications/me: Fetch user notifications
- PATCH /notifications/readAll: Mark all notifications as read
- PATCH /notifications/read/:id: Mark single notification as read

Complaint Endpoints

- POST /complaints/:shipmentId: File complaint on shipment
- GET /complaints/me: Fetch user's complaints
- GET /complaints: Fetch all complaints (admin)
- PATCH /complaints/:id: Update complaint status (admin)

Delivery Agent Endpoints

- POST /deliveryAgents: Register new delivery agent (admin)
- GET /deliveryAgents: List all delivery agents (admin)
- PATCH /deliveryAgents/myAvailability: Toggle agent availability

Dashboard Endpoints

- GET /dashboard/admin: Get admin dashboard analytics

---

Project Structure

```
LDMS/
├── package.json              # Dependencies, scripts, metadata
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript root config
├── tsconfig.app.json         # App-specific TypeScript config
├── tsconfig.node.json        # Node TypeScript config
├── eslint.config.js          # ESLint rules
├── index.html                # HTML entry point
├── public/                   # Static assets
├── src/
│   ├── main.tsx              # Entry point, Redux init, auth bootstrap
│   ├── App.tsx               # Root component with Router & ToastContainer
│   ├── index.css             # Global styles
│   ├── App.css               # App-specific styles
│   │
│   ├── app/
│   │   ├── AppRoutes.tsx        # Route definitions (public & protected)
│   │   ├── ProtectedRoute.tsx   # Route guard for auth
│   │   └── store.ts             # Redux store configuration
│   │
│   ├── lib/
│   │   └── axios.ts             # Axios instance with interceptors
│   │
│   ├── features/             # Feature modules
│   │   ├── auth/
│   │   │   ├── authSlice.ts     # Redux auth logic
│   │   │   ├── authTypes.ts     # TypeScript types
│   │   │   └── pages/
│   │   │       ├── Login.tsx
│   │   │       └── Register.tsx
│   │   │
│   │   ├── customerShipment/
│   │   │   ├── shipmentSlice.ts # Redux shipment logic
│   │   │   ├── shipmentTypes.ts # Types
│   │   │   ├── pages/           # Pages and routes
│   │   │   ├── components/      # Feature components
│   │   │   │   ├── createShipmentComponents/
│   │   │   │   ├── myShipmentComponents/
│   │   │   │   ├── trackShipments/
│   │   │   │   ├── myComplaints/
│   │   │   │   ├── notificationComponents/
│   │   │   │   └── tailgrids/
│   │   │   └── utils/
│   │   │
│   │   ├── adminShipment/
│   │   │   ├── adminSlice.ts    # Redux admin logic
│   │   │   ├── adminTypes.ts    # Types
│   │   │   ├── pages/           # Admin pages
│   │   │   ├── components/      # Feature components
│   │   │   │   ├── adminComplaints/
│   │   │   │   ├── agentManagement/
│   │   │   │   ├── agentRegisteration/
│   │   │   │   └── allShipments/
│   │   │   └── utils/
│   │   │
│   │   ├── agentShipment/
│   │   │   ├── agentSlice.ts    # Redux agent logic
│   │   │   ├── agentTypes.ts    # Types
│   │   │   ├── pages/           # Agent pages
│   │   │   ├── components/      # Feature components
│   │   │   │   ├── MyDeliveries/
│   │   │   │   └── deliveryDetails/
│   │   │   └── utils/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   ├── components/      # Dashboard-specific components
│   │   │   ├── utils/
│   │   │   └── DashobardTypes/  # Dashboard types
│   │   │
│   │   ├── profile/
│   │   │   ├── profileTypes.ts  # Types
│   │   │   └── pages/
│   │   │
│   │   └── landingPage/
│   │       ├── pages/
│   │       └── components/
│   │
│   ├── staticComponents/     # Shared layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── ProfileDropdown.tsx
│   │
│   ├── shared/               # Shared utilities, components, hooks
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   └── Toast.ts
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── reduxHooks.ts
│   │   │   └── useRole.ts
│   │   ├── types/            # Global TypeScript types
│   │   │   └── razorpay.d.ts
│   │   ├── types.ts             # Global types
│   │   └── utils.ts             # Utility functions
│   │
│   └── assets/               # Images, logos, static files
│       ├── airFreight_img.jfif
│       ├── airFreight.jfif
│       ├── bg4.avif
│       ├── Countries_image.jfif
│       ├── delivery_box.jfif
│       ├── delivery_proof.jfif
│       ├── liveTracking.jfif
│       ├── oceanFreight.jfif
│       ├── successRate.jfif
│       ├── supplyChain.jfif
│       ├── Support_bell.jfif
│       ├── support_img.jfif
│       ├── truckDelivery.jfif
│       └── warehousing.jfif
│
├── dist/                     # Production build output
└── node_modules/             # Dependencies
```

---

Setup Instructions

Requirements

Node.js: v20+ recommended
npm: v10+ (comes with Node.js)
Backend API: Running instance accessible at configured base URL

Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd LDMS
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment (Optional - backend URL hardcoded)
   
   Edit src/lib/axios.ts to change the backend URL:
   ```typescript
   const API_BASE_URL = 'https://logisticsanddeliverymanagementsystem.onrender.com/api/v1/';
   ```

### Development

```bash
# Start development server with hot reload
npm run dev
```

The app will be available at `http://localhost:5173`

Production Build

```bash
# Compile TypeScript and bundle for production
npm run build

# Preview production build locally
npm run preview
```

Linting

```bash
# Run ESLint to check code quality
npm run lint
```

---

Development Workflow

Code Quality Practices

1. Type Safety: All code uses TypeScript with strict mode enabled
2. Component Testing: Components lazy-loaded in routes for code splitting
3. State Debugging: Redux DevTools integration available
4. Error Handling: Try-catch blocks and error boundaries
5. Loading States: Loading spinners during async operations

Development Checklist

Install dependencies: npm install
Start dev server: npm run dev
Open browser: http://localhost:5173
Create Redux slice for new features
Add type definitions to shipmentTypes, authTypes, etc.
Create feature components in features/[feature]/components/
Add routes to app/AppRoutes.tsx
Use custom hooks: useAppDispatch, useAppSelector, useRole
Test with all three roles (customer, admin, agent)

Useful Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint checks
```

---

Routing Overview

Public Routes (No Authentication Required)

- / (LandingPage): Marketing landing page
- /login (Login): User login form
- /register (Register): New user registration form

Protected Routes (Authentication Required)

Customer Routes

- /customerDashboard (CustomerDashboard): Customer home dashboard
- /sendShipment (CreateShipment): Create new shipment form
- /myShipments (MyShipments): View shipment history
- /trackShipments (TrackShipments): Search & track shipments
- /trackShipments/:shipmentId (ShipmentDetail): Shipment detail view
- /customerNotifications (Notifications): In-app notifications
- /paymentSuccess (PaymentSuccess): Payment confirmation page
- /myComplaints (MyComplaints): File & view complaints

Admin Routes

- /adminDashboard (AdminDashboard): Admin home dashboard
- /agentRegisteration (CreateAgent): Register new agent
- /agentManagement (AgentManagement): Manage agent accounts
- /allShipment (AllShipments): View all shipments
- /liveTracking (AdminLiveTracking): Live track shipments
- /liveTracking/:shipmentId (ShipmentTracking): Specific shipment tracking
- /adminComplaints (AdminComplaints): Manage complaints

Delivery Agent Routes

- /agentDashboard (AgentDashboard): Agent home dashboard
- /deliveryDetail (DeliveryDetail): Delivery detail view
- /deliveryHistory (DeliveryHistory): Historical deliveries
- /agentTracking (AgentTracking): Track assigned shipments
- /agentTracking/:shipmentId (ShipmentDetail): Specific shipment tracking

Shared Protected Routes

- /profile (Profile): User profile management

---

State Management

Redux Store Overview

```typescript
// Store structure
{
  auth: {
    user: User | null
    accessToken: string | null
    loading: boolean
    error: string | null
    isInitialized: boolean
  }
  shipment: {
    shipments: Shipment[]
    currentShipment: Shipment | null
    notifications: Notification[]
    complaints: Complaint[]
    pagination: { page, limit, total }
    ...
  }
  admin: {
    agents: DeliveryAgent[]
    allShipments: Shipment[]
    complaints: Complaint[]
    dashboardData: DashboardMetrics
    ...
  }
  agent: {
    deliveries: Delivery[]
    availability: boolean
    timeline: TimelineEvent[]
    ...
  }
}
```

Redux Slices

- auth (features/auth/authSlice.ts): User authentication, tokens, initialization
- shipment (features/customerShipment/shipmentSlice.ts): Customer shipments, tracking, payments, complaints
- admin (features/adminShipment/adminSlice.ts): Agent management, system shipments, analytics
- agent (features/agentShipment/agentSlice.ts): Agent deliveries, availability, status

Custom Redux Hooks

```typescript
// Use these instead of useDispatch/useSelector
import { useAppDispatch, useAppSelector } from shared/hooks/reduxHooks;
import { useRole } from shared/hooks/useRole;

// Examples:
const dispatch = useAppDispatch();
const user = useAppSelector(state => state.auth.user);
const { role, isCustomer, isAdmin, isAgent } = useRole();
```

---

Third-Party Integrations

Razorpay Payment Gateway

Purpose: Process shipment payments
Status: Integrated and functional

Payment Flow:
1. Customer clicks "Pay" button on shipment
2. Frontend calls `/payments/initiate/:shipmentId` to create order
3. Razorpay SDK loads dynamically
4. Customer enters payment details in Razorpay modal
5. On success, frontend verifies payment: `/payments/verify/:shipmentId`
6. Backend verifies signature and updates shipment
7. Cleanup: Script and iframes removed

Implementation Details:
Script loaded dynamically (not in HTML for security)
TypeScript types: shared/types/razorpay.d.ts
Handled in: features/customerShipment/utils/shipmentHelpers.ts

Socket.io Real-Time Communication

Status: Installed (v4.8.3)
Purpose: Real-time shipment updates and notifications
Note: Usage pattern to be verified in backend implementation

External Assets & CDNs

Font Awesome Icons (via npm)
Lucide React Icons (via npm)
Google Fonts (via Tailwind)

---

Contributing Guidelines

Before Contributing

1. Ensure you have the latest code: git pull origin main
2. Install dependencies: npm install
3. Start dev server: npm run dev
4. Test with all three roles

Development Standards

Code Style
Use TypeScript for all new code (strict mode)
Follow existing naming conventions
Use camelCase for variables/functions
Use PascalCase for React components
Add JSDoc comments for complex logic

Component Structure
```typescript
// Standard component template
interface ComponentProps {
  // Props with JSDoc
  title: string;
  onAction: () => void;
}

/**
 * Brief component description
 * @param props Component properties
 * @returns React component
 */
export const MyComponent: React.FC<ComponentProps> = ({ title, onAction }) => {
  // Implementation
};
```

Redux Integration
Create thunks for async operations
Use extraReducers for async actions
Type all state and actions
Handle loading and error states

Testing Checklist
Component renders without errors
All three roles can access appropriate features
Forms validate input correctly
API calls handle errors gracefully
Loading states display properly
Mobile responsive on common breakpoints

Pull Request Process

1. Create feature branch: git checkout -b feature/feature-name
2. Make changes and commit: git commit -m "feat: description"
3. Push to remote: git push origin feature/feature-name
4. Open pull request with description
5. Address code review comments
6. Merge after approval

Commit Message Format

```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, perf, test, chore

Example: feat(auth): add two-factor authentication

---

Troubleshooting

Common Issues & Solutions

1. Blank Page / App Won't Load

Symptoms: Browser shows blank page or infinite loading

Solutions:
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Check:
- Browser console for errors (F12 → Console tab)
- Verify backend API URL in src/lib/axios.ts
- Ensure backend is running

2. 401 Unauthorized Errors

Symptoms: Unauthorized errors in network tab

Solutions:
- Clear cookies: F12 → Application → Cookies → Delete all
- Logout and login again
- Verify backend token endpoints are working
- Check src/lib/axios.ts interceptor logic

3. CORS Errors

Symptoms: Access to XMLHttpRequest blocked by CORS policy

Solutions:
- Verify backend has CORS enabled
- Check withCredentials: true in axios config
- Ensure API URL in src/lib/axios.ts matches backend

4. Payment Integration Fails

Symptoms: Razorpay modal won't open or payment verification fails

Solutions:
```typescript
// Verify Razorpay config in shipmentHelpers.ts
const options = {
  key: 'your-razorpay-key', // Check backend returns this
  amount: amount,
  currency: 'INR',
  // ... other options
};
```

- Check browser console for Razorpay SDK errors
- Verify order creation endpoint: POST /payments/initiate/:id
- Ensure verification endpoint works: POST /payments/verify/:id

5. Redux State Not Persisting

Symptoms: Auth state lost after page refresh

Solutions:
- Verify redux-persist config in app/store.ts
- Check that initializeAuth() is called on app start
- Ensure cookies are enabled in browser
- Verify refresh token endpoint works

6. TypeScript Errors

Symptoms: Type errors in IDE or build

Solutions:
```bash
# Rebuild TypeScript
npm run build

# Check specific file
npx tsc --noEmit src/path/to/file.ts
```

- Ensure all imports have correct types
- Check tsconfig.json is configured correctly
- Use proper typing for Redux state

Debug Commands

```bash
# Check all dependencies
npm list

# Verify TypeScript compilation
npm run build

# Check for lint issues
npm run lint

# Clear everything and reinstall
npm cache clean --force && rm -rf node_modules && npm install

# Run dev with verbose logging
npm run dev -- --debug
```

Getting Help

1. Check existing GitHub issues
2. Review error stack trace carefully
3. Check browser DevTools (F12)
4. Review Redux DevTools state
5. Check network tab in DevTools
6. Consult backend API documentation

---

Performance Optimizations

Code Splitting: Lazy loading routes with React.lazy()
Bundle Size: Optimized Vite build output
State Management: Redux DevTools for debugging
Image Optimization: JFIF and AVIF formats
Responsive Design: Mobile-first Tailwind CSS
Caching: Browser caching and service workers

---

License & Maintainers

Project: LDMS Frontend - Logistics & Delivery Management System
Version: 1.0.0
Status: Active Development

For questions or contributions, please contact the development team.

---

Quick Links

TypeScript Documentation (https://www.typescriptlang.org/docs/)
React Documentation (https://react.dev/)
React Router Documentation (https://reactrouter.com/)
Tailwind CSS Documentation (https://tailwindcss.com/docs)
Redux Toolkit Documentation (https://redux-toolkit.js.org/)
Vite Documentation (https://vitejs.dev/)

---

Last Updated: June 18, 2026
Maintained By: Development Team

