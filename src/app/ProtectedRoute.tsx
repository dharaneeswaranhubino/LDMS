import type React from "react";
import { useAppSelector } from "../shared/hooks/reduxHooks";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../shared/components/LoadingSpinner";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { accessToken, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <p className="text-gray-500 text-sm">Loading...</p> */}
        <LoadingSpinner/>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
