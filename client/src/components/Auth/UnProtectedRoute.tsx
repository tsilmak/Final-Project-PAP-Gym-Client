import React, { ReactNode } from "react";
import { useAppSelector } from "@/app/redux";
import { Navigate } from "react-router-dom";

// Define the prop types for the UnProtectedRoute component
interface UnProtectedRouteProps {
  children: ReactNode; // Can be any valid ReactNode, typically JSX.Element
}

const UnProtectedRoute: React.FC<UnProtectedRouteProps> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  // Redirect to home page if the user is logged in
  if (token && user) {
    return <Navigate to="/" replace />;
  }

  // Render the children if the user is not logged in
  return <>{children}</>;
};

export default UnProtectedRoute;
