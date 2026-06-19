LDMS Frontend - Logistics and Delivery Management System

A comprehensive React and TypeScript platform for end-to-end logistics and delivery management. The system provides role-based interfaces for customers, administrators, and delivery agents with real-time shipment tracking, payment processing, and operational management capabilities.

OVERVIEW

LDMS is built for modern e-commerce and logistics businesses requiring sophisticated shipment management, real-time tracking, and multi-role operational support. The platform enables complete lifecycle management from order creation through delivery completion.

Core capabilities include:

- Shipment Management: Create, monitor, and track shipments through the entire delivery lifecycle
- Live Delivery Tracking: Real-time location tracking with comprehensive timeline visualization
- Multi-Role Platform: Separate operational dashboards and workflows for each user role
- Payment Integration: Razorpay payment gateway for secure transaction processing
- Notification System: Real-time alerts and in-app notification management
- Agent Management: Complete delivery agent lifecycle and performance tracking
- Complaint Management: Structured complaint filing and resolution workflows

FEATURES

Customer Features

The customer role provides complete shipment management and tracking capabilities:

- Create Shipments: Multi-step shipment creation with validation and carrier selection
- Track Shipments: Real-time tracking by shipment ID with status timeline
- Shipment History: Paginated shipment list with search and filtering capabilities
- Online Payments: Razorpay integration for payment processing
- Notifications: Notification center with read/unread status management
- Complaint Filing: Submit and track complaints against shipments
- Profile Management: Personal profile and account information management

Administrator Features

The administrator role provides operational oversight and system management:

- Agent Registration: Delivery agent registration and account setup
- Agent Management: Delivery agent account management and performance monitoring
- Shipment Oversight: Dashboard view of all system shipments
- Live Tracking: Real-time shipment tracking and location monitoring
- Complaint Management: Complaint review and status updates
- Dashboard Analytics: System metrics including revenue, shipments, and agent performance
- Performance Metrics: System health and key performance indicators

Delivery Agent Features

The delivery agent role manages assigned shipments and delivery operations:

- Delivery Dashboard: Overview of assigned deliveries and pending operations
- Delivery Management: Accept, manage, and complete delivery assignments
- Status Updates: Mark deliveries as picked up, out for delivery, or completed
- Delivery Details: Access comprehensive information for assigned shipments
- Delivery History: Historical record of completed deliveries
- Availability Management: Set online and offline status
- Live Tracking: Track assigned shipments in real time

TECHNOLOGY STACK

TECHNOLOGY STACK

Core Framework

- React 19.2.5: User interface library
- React DOM 19.2.5: DOM rendering
- TypeScript 6.0: Type-safe development with strict mode
- Vite 8.0: Build tool and development server

State Management and Routing

- Redux Toolkit 2.11.2: Centralized state management
- React Redux 9.2.0: React bindings for Redux
- Redux Persist 6.0.0: State persistence to local storage
- React Router DOM 7.15.0: Client-side routing

HTTP and API Communication

- Axios 1.16.0: HTTP client with request and response interceptors
- Socket.io Client 4.8.3: Real-time bidirectional communication
- JWT Decode 4.0.0: JWT token parsing and validation

User Interface and Styling

- Tailwind CSS 4.2.4: Utility-first CSS framework
- Lucide React 1.14.0: Modern icon library
- React Icons 5.6.0: Icon collections
- FontAwesome 7.2.0: Enterprise icon set
- Framer Motion 12.38.0: Animation and motion library

Data Visualization and Utilities

- Recharts 3.8.1: Composable charting library
- Chart.js 4.5.1: JavaScript charting library
- React Toastify 11.1.0: Toast notification system
- React Select 5.10.2: Accessible dropdown component
- HTML2Canvas 1.4.1: Screenshot generation
- jsPDF 4.2.1: PDF generation library
- React PDF Renderer 4.5.1: PDF rendering
- Canvas Confetti 1.9.4: Animation effects
- Use Sound 5.0.0: Audio playback

Development Tools

- ESLint 10.2.1: Code quality linting
- Vite React Plugin 6.0.1: React plugin for Vite

ARCHITECTURE

The application follows a feature-based modular architecture with clear separation of concerns. The system consists of multiple layers handling routing, state management, HTTP communication, and business logic.

Architectural Layers

React Router manages application routing with public and protected route separation. All protected routes require authentication verification before access.

Redux Store provides centralized state management across four primary slices: auth for user authentication, shipment for customer shipment operations, admin for administrative functions, and agent for delivery agent operations.

Axios HTTP client handles all backend communication with automatic request and response interceptors for token injection and refresh token management.

Backend API integration connects to the cloud-deployed REST API at https://logisticsanddeliverymanagementsystem.onrender.com/api/v1/ providing endpoints for authentication, shipment management, payments, notifications, complaints, and agent operations.

External Services include Razorpay for payment processing, Socket.io for real-time updates, and cloud file storage for document management.

Component Hierarchy

The application root initializes Redux store and authentication state. The Router component manages public routes including landing page, login, and registration. Protected routes require authentication and utilize route guards. The DashboardLayout component provides the main application interface with sidebar navigation and top bar. Feature-specific routes include shipment management, payment processing, complaint handling, agent management, and live tracking. All protected routes render through the ProtectedRoute guard component.

AUTHENTICATION AND SECURITY

Authentication Flow

Application initialization calls initializeAuth() to restore user session from stored refresh token. The system attempts to refresh the access token using the refresh token stored in HTTP-only cookies. On successful refresh, the user object and access token are loaded into Redux state. On failure, the user is redirected to the login page for re-authentication.

Token Management

Access tokens are short-lived JWT tokens stored in Redux state and injected into request Authorization headers. Refresh tokens are long-lived tokens stored exclusively in HTTP-only cookies, preventing XSS attacks. Token refresh occurs automatically on 401 responses with request queuing during refresh. Redux persists state to local storage excluding sensitive token data.

Security Implementation

HTTPS is enforced in production environments. HTTP-only cookies prevent token access via JavaScript. Bearer token authentication uses proper Authorization header formatting. CORS policies are properly configured for cross-origin requests. Failed refresh triggers automatic logout and redirect to login. All private routes are protected with authentication guards.

API ENDPOINTS

Base URL: https://logisticsanddeliverymanagementsystem.onrender.com/api/v1/

Authentication

- POST /auth/login: User login with credentials
- POST /auth/register: New user account creation
- POST /auth/logout: Logout and token invalidation
- POST /auth/refreshToken: Access token refresh using HTTP-only refresh token

Shipments

- POST /shipments: Create new shipment
- GET /shipments: List all shipments (admin only)
- GET /shipments/myShipments: List user's shipments
- GET /shipments/:id: Retrieve shipment details
- GET /shipments/:id/timeline: Retrieve shipment status timeline
- PATCH /shipments/:id: Update shipment information
- PATCH /shipments/status/:id: Update shipment status
- GET /shipments/myDeliveries: List agent's assigned deliveries

Payments

- POST /payments/initiate/:shipmentId: Create payment order
- POST /payments/verify/:shipmentId: Verify payment completion
- GET /payments/:shipmentId: Retrieve payment details

Notifications

- GET /notifications/me: Retrieve user notifications
- PATCH /notifications/readAll: Mark all notifications as read
- PATCH /notifications/read/:id: Mark specific notification as read

Complaints

- POST /complaints/:shipmentId: File complaint
- GET /complaints/me: List user's complaints
- GET /complaints: List all complaints (admin only)
- PATCH /complaints/:id: Update complaint status

Delivery Agents

- POST /deliveryAgents: Register delivery agent
- GET /deliveryAgents: List all agents (admin only)
- PATCH /deliveryAgents/myAvailability: Update agent availability status

Dashboard

- GET /dashboard/admin: Retrieve admin dashboard analytics

PROJECT STRUCTURE

The project organization follows a feature-based modular pattern with clear separation between configuration, shared utilities, and feature-specific code.

Configuration and Entry Points

- package.json: Project metadata, dependencies, and scripts
- vite.config.ts: Vite build configuration
- tsconfig.json: TypeScript root configuration
- tsconfig.app.json: Application-specific TypeScript settings
- tsconfig.node.json: Node-specific TypeScript settings
- eslint.config.js: Linting rules and configuration
- index.html: HTML entry point
- public/: Static assets served by the server

Source Code Organization

- src/main.tsx: Application entry point with Redux store initialization and authentication bootstrap
- src/App.tsx: Root component with router and notification container
- src/index.css: Global styles
- src/App.css: Application-level styles

Application Configuration

- src/app/AppRoutes.tsx: Complete route definitions for public and protected routes
- src/app/ProtectedRoute.tsx: Route guard component for authentication verification
- src/app/store.ts: Redux store configuration and middleware setup

Libraries and Utilities

- src/lib/axios.ts: Axios instance with request/response interceptors, token injection, and automatic refresh logic

Feature Modules

The features directory contains business logic organized by user role and functionality:

- src/features/auth/: User authentication including login, registration, password change
- src/features/customerShipment/: Customer shipment operations, tracking, payments, and complaints
- src/features/adminShipment/: Administrative operations including agent management and system oversight
- src/features/agentShipment/: Delivery agent operations including delivery management and tracking
- src/features/dashboard/: Role-specific dashboard implementations
- src/features/profile/: User profile management
- src/features/landingPage/: Public landing page

Shared Components and Utilities

- src/staticComponents/: Layout components including DashboardLayout, Sidebar, Topbar, ProfileDropdown
- src/shared/components/: Reusable UI components
- src/shared/hooks/: Custom React hooks for Redux integration and role-based access
- src/shared/types/: Global TypeScript type definitions
- src/shared/utils.ts: Utility functions

Assets

- src/assets/: Images and static resources in JFIF and AVIF formats

SETUP AND INSTALLATION

Requirements

- Node.js v20 or later
- npm v10 or later (included with Node.js)
- Backend API running and accessible

Installation Steps

1. Clone the repository
   git clone <repository-url>
   cd LDMS

2. Install dependencies
   npm install

3. Configure environment settings

   Edit src/lib/axios.ts to update the backend API URL if needed:
   
   const API_BASE_URL = 'https://logisticsanddeliverymanagementsystem.onrender.com/api/v1/';

Development Server

Start the development server with hot module reload:

npm run dev

The application will be available at http://localhost:5173

Production Build

Build the application for production deployment:

npm run build

Preview the production build locally:

npm run preview

Code Quality

Run ESLint to verify code quality:

npm run lint

DEVELOPMENT WORKFLOW

Code Quality Standards

All code uses TypeScript with strict mode enabled for type safety. Components are lazy-loaded in routes for optimal code splitting. Redux DevTools are integrated for state debugging. Error handling uses try-catch blocks and error boundaries. Loading states display spinners during asynchronous operations.

Development Process

1. Install dependencies: npm install
2. Start development server: npm run dev
3. Verify browser access at http://localhost:5173
4. Create Redux slices for new features
5. Add TypeScript type definitions to appropriate type files
6. Implement feature components in features/[feature]/components/
7. Add routes to app/AppRoutes.tsx
8. Use custom hooks useAppDispatch, useAppSelector, and useRole
9. Test implementation with all three user roles

Useful Commands

npm run dev        Start development server with hot reload
npm run build      Build for production
npm run preview    Preview production build
npm run lint       Run ESLint checks

ROUTING CONFIGURATION

Public Routes

- /: Landing page with marketing content
- /login: User login interface
- /register: New user registration form

Protected Customer Routes

- /customerDashboard: Customer dashboard and overview
- /sendShipment: Shipment creation form
- /myShipments: User's shipment history
- /trackShipments: Shipment search and tracking
- /trackShipments/:shipmentId: Shipment detail view
- /customerNotifications: Notification center
- /paymentSuccess: Payment confirmation page
- /myComplaints: Complaint filing and tracking
- /profile: User profile management

Protected Administrator Routes

- /adminDashboard: Administrator dashboard and analytics
- /agentRegisteration: Agent registration form
- /agentManagement: Agent account management
- /allShipment: System-wide shipment view
- /liveTracking: Live shipment tracking
- /liveTracking/:shipmentId: Specific shipment tracking detail
- /adminComplaints: Complaint management
- /profile: User profile management

Protected Delivery Agent Routes

- /agentDashboard: Agent dashboard and assigned deliveries
- /deliveryDetail: Delivery operation details
- /deliveryHistory: Historical delivery records
- /agentTracking: Assigned shipment tracking
- /agentTracking/:shipmentId: Specific shipment tracking detail
- /profile: User profile management

STATE MANAGEMENT

Redux Store Structure

The Redux store maintains application state across four primary slices:

auth: User authentication state including user object, access token, loading state, errors, and initialization flag

shipment: Customer shipment operations including shipments array, current shipment, notifications, complaints, pagination, and dashboard data

admin: Administrative state including agents list, all shipments, complaints, dashboard analytics, and pagination

agent: Delivery agent state including assigned deliveries, availability status, timeline events, and tracking data

Redux Integration

auth slice (features/auth/authSlice.ts): Handles user authentication, token management, profile updates, and password changes

shipment slice (features/customerShipment/shipmentSlice.ts): Manages customer shipments, tracking, payment processing, complaints, and notifications

admin slice (features/adminShipment/adminSlice.ts): Manages agent lifecycle, system shipments, complaint resolution, and analytics

agent slice (features/agentShipment/agentSlice.ts): Manages agent deliveries, availability, and shipment tracking

Custom Hooks

Use the provided custom hooks instead of standard Redux hooks:

import { useAppDispatch, useAppSelector } from shared/hooks/reduxHooks;
import { useRole } from shared/hooks/useRole;

const dispatch = useAppDispatch();
const user = useAppSelector(state => state.auth.user);
const { role, isCustomer, isAdmin, isAgent } = useRole();

THIRD-PARTY INTEGRATIONS

Razorpay Payment Processing

Razorpay processes all customer payments with integration managed through the payment slice.

Payment Flow: Customer initiates payment, frontend creates order via /payments/initiate/:shipmentId, Razorpay SDK loads and displays payment modal, customer completes payment, frontend verifies payment via /payments/verify/:shipmentId, backend confirms signature and updates shipment status.

Implementation: Razorpay SDK loads dynamically for security, TypeScript types located in shared/types/razorpay.d.ts, payment logic in features/customerShipment/utils/shipmentHelpers.ts

Real-Time Communication

Socket.io Client version 4.8.3 is installed for real-time shipment updates and notifications. Current usage patterns are managed by backend implementation.

CONTRIBUTING GUIDELINES

Before Contributing

- Pull latest code: git pull origin main
- Install dependencies: npm install
- Start development server: npm run dev
- Test functionality with all three user roles

Development Standards

Code Style: Use TypeScript for all new code with strict mode enabled. Follow existing naming conventions using camelCase for variables and functions, PascalCase for React components. Add JSDoc comments for complex logic.

Component Structure: Define component props interfaces with JSDoc documentation. Export components as named exports with React.FC type annotation.

Redux Integration: Create async thunks for backend operations. Use extraReducers for handling async actions. Type all state and actions. Implement loading and error states.

Testing Requirements: Verify components render without errors. Test with all three user roles. Validate form inputs. Verify API error handling. Test loading state display. Confirm mobile responsiveness.

Pull Request Process

1. Create feature branch: git checkout -b feature/feature-name
2. Make changes and commit: git commit -m "feat: description"
3. Push to remote: git push origin feature/feature-name
4. Open pull request with detailed description
5. Address code review comments
6. Merge after approval

Commit Message Format

Commits should follow conventional commit format:

type(scope): subject

body

footer

Types: feat for features, fix for bug fixes, docs for documentation, style for formatting, refactor for code restructuring, perf for performance improvements, test for tests, chore for maintenance

Example: feat(auth): add two-factor authentication

TROUBLESHOOTING

Issue: Blank Page or App Won't Load

Diagnosis: Browser displays blank page or infinite loading spinner

Resolution Steps:

npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev

Verification:
- Check browser console for errors (F12 → Console)
- Verify backend API URL in src/lib/axios.ts
- Confirm backend API is running
- Review network tab for failed requests

Issue: 401 Unauthorized Errors

Diagnosis: Network requests fail with 401 status

Resolution Steps:
- Clear cookies (F12 → Application → Cookies → Delete all)
- Logout and login again
- Verify backend token endpoints are functional
- Review src/lib/axios.ts interceptor implementation

Issue: CORS Errors

Diagnosis: XMLHttpRequest blocked by CORS policy

Resolution Steps:
- Verify backend CORS configuration
- Confirm withCredentials setting in axios configuration
- Verify API URL matches backend configuration

Issue: Payment Integration Failures

Diagnosis: Razorpay modal fails to open or payment verification fails

Resolution Steps:
- Check browser console for SDK errors
- Verify order creation endpoint /payments/initiate/:id works
- Verify payment verification endpoint /payments/verify/:id works
- Review Razorpay configuration in shipmentHelpers.ts

Issue: Redux State Not Persisting

Diagnosis: User authentication lost after page refresh

Resolution Steps:
- Verify redux-persist configuration in app/store.ts
- Confirm initializeAuth() is called on app startup
- Verify browser cookies are enabled
- Test refresh token endpoint functionality

Issue: TypeScript Compilation Errors

Diagnosis: Type errors appear in IDE or build process

Resolution Steps:

npm run build

npx tsc --noEmit src/path/to/file.ts

Verification:
- Ensure imports include proper type definitions
- Review tsconfig.json settings
- Verify Redux state typing

Debug Commands

npm list                                      Check all dependencies
npm run build                                 Verify TypeScript compilation
npm run lint                                  Check for linting issues
npm cache clean --force && rm -rf node_modules && npm install    Full reset
npm run dev -- --debug                        Run dev with verbose logging

Support Resources

Review existing GitHub issues for similar problems
Examine error stack traces carefully
Review browser DevTools console and network tabs
Check Redux DevTools for state inspection
Consult backend API documentation

PERFORMANCE OPTIMIZATION

Code Splitting: Routes use React.lazy() for code splitting and lazy loading

Build Optimization: Vite build produces optimized production bundles with tree shaking

State Management: Redux DevTools integration for efficient debugging

Image Optimization: Assets use JFIF and AVIF formats

Responsive Design: Mobile-first Tailwind CSS approach

Browser Caching: Leverages browser caching and service worker support

PROJECT INFORMATION

Title: LDMS Frontend - Logistics and Delivery Management System
Version: 1.0.0
Status: Active Development
Last Updated: June 19, 2026
Development Team: Active Development

ADDITIONAL RESOURCES

- TypeScript Documentation: https://www.typescriptlang.org/docs/
- React Documentation: https://react.dev/
- React Router Documentation: https://reactrouter.com/
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Redux Toolkit Documentation: https://redux-toolkit.js.org/
- Vite Documentation: https://vitejs.dev/
- Axios Documentation: https://axios-http.com/docs/intro

