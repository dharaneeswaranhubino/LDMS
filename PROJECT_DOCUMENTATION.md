# SmartShip Frontend - Comprehensive Project Documentation

## Executive Summary

SmartShip Frontend is a sophisticated React and TypeScript web application for comprehensive logistics and delivery management. The platform serves three distinct user roles (customer, administrator, and delivery agent) through a unified codebase with role-based routing, state management, and UI. The application integrates with a backend REST API for shipment management, payment processing, agent operations, and system administration.

## Project Overview

SmartShip is a React + TypeScript + Vite frontend for a logistics delivery management system. The application supports role-based experiences for customers, administrators, and delivery agents. It provides shipment creation, tracking, live monitoring, notifications, payments, complaints, and user profile management.

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

Routes accessible without authentication:
- `/`: Landing page with marketing content and service showcase
- `/login`: User login form with email/password authentication
- `/register`: User registration form with account creation

### Protected Routes

All protected routes are wrapped with ProtectedRoute guard component and rendered under DashboardLayout with Sidebar and Topbar. Routes require valid authentication state and access token.

Customer Routes:
- `/customerDashboard`: Customer home dashboard with recent shipments and analytics
- `/sendShipment`: Multi-step shipment creation form
- `/myShipments`: Paginated list of user's shipments with filters
- `/trackShipments`: Shipment search and tracking interface
- `/trackShipments/:shipmentId`: Detailed shipment tracking with timeline
- `/customerNotifications`: Notification center with read/unread management
- `/paymentSuccess`: Payment confirmation and receipt page
- `/myComplaints`: Complaint history and status tracking
- `/customerChat`: Customer chat interface for support communication
- `/profile`: User profile management and account settings

Administrator Routes:
- `/adminDashboard`: Admin dashboard with system metrics and analytics
- `/agentManagement`: Delivery agent management interface
- `/agentManagement/agentRegisteration`: Agent registration form
- `/allShipment`: System-wide shipment list with management options
- `/allShipment/reassign/:shipmentId`: Reassign shipment to different agent
- `/liveTracking`: Live shipment tracking with location visualization
- `/liveTracking/:shipmentId`: Specific shipment tracking detail
- `/adminComplaints`: Complaint management and resolution interface
- `/profile`: User profile management

Delivery Agent Routes:
- `/agentDashboard`: Agent dashboard with assigned deliveries and metrics
- `/deliveryDetail`: Delivery operations interface
- `/deliveryDetail/:shipmentId`: Specific delivery detail view
- `/deliveryHistory`: Historical record of completed deliveries
- `/payments`: Payment details and verification
- `/agentTracking`: Agent's assigned shipment tracking
- `/agentTracking/:shipmentId`: Specific shipment tracking detail
- `/agentChat`: Agent chat interface for customer communication
- `/profile`: User profile management

## Feature Implementations

### Authentication Feature

Location: `src/features/auth/`

Components:
- `Login.tsx`: Login page with email/password form, local validation, role-based redirect
- `Register.tsx`: Registration form with validation, password confirmation, success page

Redux Slice: `authSlice.ts`
- Thunk initializeAuth handles app startup authentication restoration
- Thunk loginUser handles user login with email/password
- Thunk registerUser handles new account creation with validation
- Thunk logoutUser handles session termination
- Thunk updateProfile handles profile information updates
- Thunk changePassword handles password changes with verification

Types: `authTypes.ts`
- User interface defining user object structure with role and profile data
- AuthState interface defining Redux state shape
- Request/response payload interfaces for all auth operations

### Customer Shipment Feature

Location: `src/features/customerShipment/`

Pages:
- `CreateShipment.tsx`: Multi-step shipment creation with form validation and price calculation
- `MyShipment.tsx`: Shipment list with filtering, search, sorting, and pagination
- `TrackShipment.tsx`: Shipment tracking with timeline visualization and status display
- `CustomerNotifications.tsx`: Notification center with read/unread management
- `PaymentDetails.tsx`: Payment information display and verification
- `MyComplaints.tsx`: Complaint history with status filtering and details
- `CustomerChat.tsx`: Chat interface for customer support communication

Components:
- `createShipmentComponents/`: Multi-step form components including address entry, package details, price breakdown
- `myShipmentComponents/`: Reusable components for shipment list display and filtering
- `notificationComponents/`: Notification list and notification item components
- `trackShipments/`: Timeline and tracking visualization components
- `myComplaints/`: Complaint list and complaint detail components
- `tailgrids/`: Reusable grid-based layout components

Redux Slice: `shipmentSlice.ts`
- Thunk createShipment submits new shipment with validation
- Thunk updateShipment modifies existing shipment details
- Thunk fetchMyShipments retrieves user's shipment list with pagination
- Thunk fetchShipmentById retrieves specific shipment details
- Thunk fetchShipmentTimeline retrieves shipment status history
- Thunk initiatePayment creates payment order with Razorpay
- Thunk verifyPayment validates payment completion
- Thunk fetchPaymentDetails retrieves payment information
- Thunk fetchNotifications retrieves user notifications
- Thunk markNotificationRead marks single notification as read
- Thunk markAllNotificationsRead marks all notifications as read
- Thunk raiseComplaint creates new complaint
- Thunk fetchMyComplaints retrieves user's complaints with pagination

Utilities:
- `shipmentHelpers.ts`: Status configuration, price calculation logic, carrier selection
- `socketService.ts`: Socket.io integration for real-time updates
- `shipmentMapper.ts`: Data mapping from form data to backend payload format

Types: `shipmentTypes.ts`
- ShipmentResponse, ShipmentState interfaces for state shape
- Address, PackageDetails interfaces for form data
- CreateShipmentPayload interface for API request structure
- Payment, Notification, Complaint interfaces for related features

### Admin Shipment Feature

Location: `src/features/adminShipment/`

Pages:
- `AdminDashboard.tsx`: Dashboard with analytics, revenue charts, agent performance, complaint summary
- `CreateAgent.tsx`: Delivery agent registration form for admin
- `AgentManagement.tsx`: Agent list with management options and performance view
- `Adminallshipments.tsx`: System-wide shipment list with pagination and filtering
- `AdminLiveTracking.tsx`: Real-time shipment tracking with location visualization
- `AdminComplaints.tsx`: Complaint management interface with status updates
- `AdminShipmentReassign.tsx`: Interface to reassign shipment to different agent

Components:
- `allShipments/`: Shipment table, detail modals, and management components
- `agentManagement/`: Agent list, performance metrics, and detail views
- `agentRegisteration/`: Agent registration form components
- `adminComplaints/`: Complaint table and management interface

Redux Slice: `adminSlice.ts`
- Thunk createAgentDetails registers new delivery agent
- Thunk getAllAgents fetches all delivery agents list
- Thunk fetchAllShipments retrieves paginated shipments for all users
- Thunk fetchAdminDashboard retrieves dashboard analytics and metrics
- Thunk fetchComplaints retrieves all system complaints with pagination
- Thunk updateComplaintStatus updates complaint resolution status
- Thunk reassignShipment reassigns shipment to different agent
- Thunk completeShipment marks shipment as completed
- Thunk fetchShipmentTimeline retrieves detailed shipment timeline

Utilities:
- `adminShipmentHelper.ts`: Dashboard data generation, metrics calculation

Types: `adminTypes.ts`
- AdminState interface defining Redux state shape
- DeliveryAgent interface for agent data structure
- AdminComplaint interface for complaint management
- AdminDashboardData interface for dashboard metrics

### Delivery Agent Feature

Location: `src/features/agentShipment/`

Pages:
- `AgentDashboard.tsx`: Agent home dashboard with assigned deliveries and metrics
- `DeliveryDetail.tsx`: Delivery operation interface with status updates
- `DeliveryHistory.tsx`: Historical record of completed deliveries
- `AgentTracking.tsx`: Real-time tracking of assigned shipments
- `ShipmentDetailView.tsx`: Detailed view of specific shipment assignment
- `AgentChat.tsx`: Chat interface for customer communication

Components:
- `MyDeliveries/`: Delivery card display, status indicators, and action buttons
- `deliveryDetails/`: Delivery detail components including proof of delivery, OTP verification

Redux Slice: `agentSlice.ts`
- Thunk getMyDeliveries fetches agent's assigned deliveries
- Thunk updateTrackStatus updates delivery status with proof and details
- Thunk toggleAvailability toggles agent online/offline status
- Thunk fetchAgentDashboard retrieves agent dashboard data

Utilities:
- `mockDelivery.ts`: Mock delivery data for development and testing
- `statusHelpers.ts`: Status formatting and status-related utility functions

Types: `agentTypes.ts`
- AgentState interface defining Redux state shape
- DeliveryItem interface for delivery data structure
- UpdateTrackStatus interface for status update payload

### Dashboard Feature

Location: `src/features/dashboard/`

Pages:
- `CustomerDashboard.tsx`: Customer home dashboard with recent shipments and analytics
- `AdminDashboard.tsx`: Admin dashboard with system metrics and revenue charts
- `AgentDashboard.tsx`: Delivery agent dashboard with assigned deliveries

Components:
- Role-specific dashboard UI components
- Analytics cards, charts, and summary widgets
- Performance metrics and KPI displays

Utilities:
- `CustomerDashboardHelper.ts`: Customer dashboard data generation
- `AdminDashboardHelper.ts`: Admin dashboard mock data generation
- `AgentDashboardHelper.ts`: Agent dashboard data utilities

### Landing Page Feature

Location: `src/features/landingPage/`

Pages:
- `LandingPage.tsx`: Public marketing landing page

Components:
- `Navbar.tsx`: Navigation bar with links and mobile menu trigger
- `HeroSection.tsx`: Hero banner with call-to-action
- `StatsSection.tsx`: Key statistics and metrics display
- `ServicesSection.tsx`: Service descriptions and feature showcase
- `CTASection.tsx`: Call-to-action section for user engagement
- `Footer.tsx`: Footer with links and contact information
- `MobileMenu.tsx`: Responsive mobile navigation menu

### Profile Feature

Location: `src/features/profile/`

Pages:
- `ProfilePage.tsx`: User profile management and account settings

Components:
- `ProfileView.tsx`: Profile information display
- `ProfileForm.tsx`: Profile information editing form
- `ChangePasswordForm.tsx`: Password change interface

## Shared Components and Utilities

### Static Components (src/staticComponents/)

DashboardLayout:
- Wrapper component for all protected routes
- Combines Sidebar, Topbar, and Outlet for main content
- Provides consistent layout for authenticated users

Sidebar:
- Left navigation menu with role-aware route filtering
- Dynamic badge counts for notifications and tasks
- Collapsible menu for responsive design

Topbar:
- Application header with user profile access
- Notification dropdown with unread count
- Search bar and action buttons

ProfileDropdown:
- User profile menu with logout option
- Display user name and role
- Quick access to profile page

### Shared Components (src/shared/components/)

Button:
- Reusable button component with variants and sizes
- Loading state support for async operations
- Accessibility features

Input:
- Reusable input field component
- Validation feedback display
- Multiple input types supported

Pagination:
- Reusable pagination component for lists
- Configurable items per page
- Page navigation with previous/next

LoadingSpinner:
- Centered loading animation
- Customizable size and color
- Used across the application for loading states

Toast:
- Toast notification utility
- Success, error, warning, and info types
- Auto-dismiss functionality

LineChart:
- Recharts-based line chart component
- Responsive design
- Used in dashboards for time-series data

DonutChart:
- Recharts-based donut/pie chart component
- Legend and tooltip support
- Used for distribution visualization

DateRangePicker:
- Date range selection component
- Calendar interface
- Used for filtering and reporting

ChatWindow:
- Chat interface component
- Message display and input
- Used for customer support communication

### Shared Hooks (src/shared/hooks/)

reduxHooks.ts:
- useAppDispatch: Typed dispatch hook for Redux actions
- useAppSelector: Typed selector hook for Redux state

useRole.ts:
- useRole: Returns current user role and role-checking utilities
- isCustomer, isAdmin, isAgent boolean flags
- Enables role-based conditional rendering

### Shared Utilities (src/shared/)

utils.ts:
- Date formatting utilities for display
- Time zone handling functions
- Common string manipulation utilities

cn.ts:
- Tailwind CSS class merging utility
- Prevents duplicate or conflicting classes
- Improves component styling flexibility

## Development Workflow

### Setup and Installation

Prerequisites:
- Node.js 20 or later
- npm 10 or later
- Git for version control

Clone Repository:
git clone <repository-url>
cd LDMS

Install Dependencies:
npm install

Environment Configuration:
Create `.env.local` file in project root with:
VITE_API_BASE_URL=http://localhost:5000/api/v1

Adjust the API base URL to match backend deployment.

### Running Development Server

npm run dev

Starts Vite development server with hot module reload at http://localhost:5173

### Building for Production

npm run build

Performs TypeScript compilation and creates optimized production bundle in `dist/` directory

### Preview Production Build

npm run preview

Serves the production build locally for testing before deployment

### Code Quality and Linting

npm run lint

Runs ESLint to check code quality and enforce style rules

## Development Standards and Best Practices

### TypeScript Standards

All code uses TypeScript with strict mode enabled. Type safety is enforced through:
- Explicit type annotations for function parameters and return types
- Interface definitions for data structures
- Type-safe Redux setup with typed dispatch and selector hooks
- Type-safe Axios responses with response type definitions

### Component Structure

React components follow consistent patterns:
- Functional components using React hooks
- Props interfaces with JSDoc comments
- Consistent naming conventions (PascalCase for components)
- Separation of concerns between presentation and logic

### Redux Integration

Redux implementation follows Redux Toolkit patterns:
- Async thunks for API operations with proper typing
- ExtraReducers for handling async action states
- Normalized state structure for complex data
- Selectors for accessing state values

### Error Handling

Comprehensive error handling throughout:
- Try-catch blocks for async operations
- Detailed error messages for user feedback
- Error boundaries for React component errors
- Network error handling with user notification

### Code Organization

Code is organized by feature with:
- Pages for route components
- Components for reusable UI elements
- Redux slices for state management
- Types for TypeScript interfaces
- Utils for helper functions

## Deployment and Production

### Build Optimization

- Code splitting with lazy loading for routes
- Tree shaking to remove unused code
- CSS minification with Tailwind CSS
- JavaScript minification and bundling with Vite

### Performance Considerations

- Lazy loading of route components
- Component memoization where appropriate
- Image optimization with JFIF and AVIF formats
- CSS utility class optimization with Tailwind CSS

### Environment Configuration

Production deployments use environment variables:
- VITE_API_BASE_URL: Production backend API URL
- Additional configuration as needed for deployment

## Testing and Quality Assurance

### Manual Testing Procedures

All three user roles should be tested:
- Customer: Shipment creation, tracking, payment, notifications
- Administrator: Agent management, shipment oversight, complaints
- Delivery Agent: Delivery assignment, status updates, tracking

### Key Testing Scenarios

- User authentication flows (login, register, logout)
- Shipment lifecycle (creation, tracking, completion)
- Payment processing with Razorpay integration
- Real-time updates through Socket.io
- Role-based access control enforcement
- Error handling and validation

### Browser Compatibility

Application targets modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting and Support

### Common Issues

Blank Page or App Won't Load:
- Clear browser cache and localStorage
- Check VITE_API_BASE_URL in .env.local
- Verify backend API is running and accessible
- Check browser console for JavaScript errors

Authentication Failures:
- Clear cookies and localStorage
- Logout and login again
- Verify backend token endpoints working
- Check Axios interceptor configuration

CORS Errors:
- Verify backend CORS configuration allows frontend origin
- Check withCredentials in Axios config
- Ensure API URL matches backend configuration

Payment Processing Issues:
- Verify Razorpay credentials and environment
- Check payment endpoints in backend
- Review browser console for SDK errors
- Verify order creation and verification flows

### Debug Commands

npm run dev: Start development server
npm run build: Build for production
npm run preview: Preview production build
npm run lint: Check code quality
npm cache clean --force: Clear npm cache

## Future Enhancements and Roadmap

Potential improvements for future releases:
- Advanced analytics and reporting
- Predictive delivery estimations
- Mobile application (React Native)
- Real-time GPS tracking enhancement
- Multi-language support
- Progressive Web App (PWA) capabilities
- Integration with additional payment gateways
- Machine learning for route optimization
- Enhanced security features (2FA, biometric)

## Notes and Observations

- All state management uses Redux exclusively for consistency
- Access tokens are not persisted to localStorage for security
- HTTP-only cookies handle refresh token storage on backend
- Role enforcement occurs at both routing and component levels
- Mock data generators used for dashboards when backend data unavailable
- Socket.io integrated for real-time updates, usage patterns per backend
- Some profile features marked for future implementation
- Application tested across all three user roles and workflows
