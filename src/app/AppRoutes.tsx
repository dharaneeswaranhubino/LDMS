import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import AgentDashboard from "../features/dashboard/pages/AgentDashboard";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";
import CreateShipment from "../features/shipment/pages/CreateShipment";
import CustomerDashboard from "../features/dashboard/pages/CustomerDashboard";
import ProfilePage from "../features/profile/ProfilePage";
import MyShipment from "../features/shipment/pages/MyShipment";
import LandingPage from "../features/landingPage/pages/LandingPage";
import TrackShipment from "../features/shipment/pages/TrackShipment";
import CreateAgent from "../features/adminShipment/pages/CreateAgent";
import AgentManagement from "../features/adminShipment/pages/AgentManagement";
import AdminAllShipments from "../features/adminShipment/pages/Adminallshipments";
import AdminLiveTracking from "../features/adminShipment/pages/AdminLiveTracking";
import DeliveryDetail from "../features/agentShipment/pages/DeliveryDetail";

const AppRoutes = () => {
  return (
    <BrowserRouter>
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
          <Route path="/agentDashboard" element={<AgentDashboard />} />
          
          <Route path="/profile" element={<ProfilePage/>}/>

          <Route path="/sendShipment" element={<CreateShipment />} />
          <Route path="/myShipments" element={<MyShipment />} />
          <Route path="/trackShipments" element={<TrackShipment />} />

          <Route path="/agentRegisteration" element={<CreateAgent/>}/>
          <Route path="/agentManagement" element={<AgentManagement/>}/>
          <Route path="/allShipment" element={<AdminAllShipments/>}/>
          <Route path="/liveTracking" element={<AdminLiveTracking/>}/>

          <Route path="/deliveryDetail" element={<DeliveryDetail/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
