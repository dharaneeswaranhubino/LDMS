import { useAppSelector } from "./reduxHooks";

const useRole = () => {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || "";
  const hasRole = (allowedRole: string) => {
    if (!user) return false;
    return role === allowedRole;
  };

  return {
    role,
    hasRole,
    isAdmin: role === "admin",
    isAgent: role === "deliveryAgent",
    isCustomer: role === "customer",
  };
};

export default useRole;