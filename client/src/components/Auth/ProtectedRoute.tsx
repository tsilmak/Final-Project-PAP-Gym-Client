import React, { ReactNode } from "react";
import { useAppSelector } from "@/app/redux";
import { Navigate } from "react-router-dom";

interface ProtectedRoute {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRoute> = ({ children }) => {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  if (!token && !user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
