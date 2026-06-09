import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../staticComponents/DashboardLayout";
import LoadingSpinner from "../shared/components/LoadingSpinner";
import AgentTracking from "../features/agentShipment/pages/AgentTracking";
const Login = lazy(() => import("../features/auth/pages/Login"));
const Register = lazy(() => import("../features/auth/pages/Register"));
const LandingPage = lazy(
  () => import("../features/landingPage/pages/LandingPage"),
);
const AgentDashboard = lazy(
  () => import("../features/dashboard/pages/AgentDashboard"),
);
const AdminDashboard = lazy(
  () => import("../features/dashboard/pages/AdminDashboard"),
);
const CustomerDashboard = lazy(
  () => import("../features/dashboard/pages/CustomerDashboard"),
);
const CreateShipment = lazy(
  () => import("../features/customerShipment/pages/CreateShipment"),
);
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const MyShipments = lazy(
  () => import("../features/customerShipment/pages/MyShipment"),
);
const TrackShipment = lazy(
  () => import("../features/customerShipment/pages/TrackShipment"),
);
const CreateAgent = lazy(
  () => import("../features/adminShipment/pages/CreateAgent"),
);
const AgentManagement = lazy(
  () => import("../features/adminShipment/pages/AgentManagement"),
);
const AdminAllShipments = lazy(
  () => import("../features/adminShipment/pages/Adminallshipments"),
);
const AdminLiveTracking = lazy(
  () => import("../features/adminShipment/pages/AdminLiveTracking"),
);
const DeliveryDetail = lazy(
  () => import("../features/agentShipment/pages/DeliveryDetail"),
);
const DeliveryHistory = lazy(
  () => import("../features/agentShipment/pages/DeliveryHistory"),
);

const PaymentDetails = lazy(
  () => import("../features/customerShipment/pages/PaymentDetails"),
);

const CustomerNotifications = lazy(
  () => import("../features/customerShipment/pages/CustomerNotifications"),
);
const PaymentSuccessScreen = lazy(
  () =>
    import("../features/customerShipment/components/createShipmentComponents/PaymentSuccessScreen"),
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            {/* <p>Loading page...</p> */}
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/customerDashboard" element={<CustomerDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* customer screens */}
            <Route path="/sendShipment" element={<CreateShipment />} />
            <Route path="/myShipments" element={<MyShipments />} />
            <Route path="/trackShipments" element={<TrackShipment />} />
            <Route path="/trackShipments/:shipmentId" element={<TrackShipment />}/>
            <Route
              path="/customerNotifications"
              element={<CustomerNotifications />}
            />
            <Route path="/paymentSuccess" element={<PaymentSuccessScreen />} />
            {/* admin screens */}
            <Route path="/agentRegisteration" element={<CreateAgent />} />
            <Route path="/agentManagement" element={<AgentManagement />} />
            <Route path="/allShipment" element={<AdminAllShipments />} />
            <Route path="/liveTracking" element={<AdminLiveTracking />} />
            <Route path="/liveTracking/:shipmentId" element={<AdminLiveTracking />} />
            {/* <Route path="/liveTracking" element={<TrackShipment />} /> */}
            {/* agent screens */}
            <Route path="/agentDashboard" element={<AgentDashboard />} />
            <Route path="/deliveryDetail" element={<DeliveryDetail />} />
            <Route path="/deliveryHistory" element={<DeliveryHistory />} />
            <Route path="/payments/" element={<PaymentDetails />} />
            <Route path="/agentTracking/" element={<AgentTracking/>} />
            <Route path="/agentTracking/:shipmentId" element={<AgentTracking/>} />
            {/* <Route path="/payments/:shipmentId" element={<PaymentDetails />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
