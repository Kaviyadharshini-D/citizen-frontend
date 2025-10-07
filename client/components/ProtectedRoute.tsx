import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const location = useLocation();

  // Add error handling for useUser hook
  let userContext;
  try {
    userContext = useUser();
  } catch (error) {
    // If UserContext is not available, redirect to login
    console.error("UserContext not available:", error);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const { user, isAuthenticated } = userContext;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If no specific roles are required, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (user && user.role && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Redirect based on user role if they don't have access
  let redirectPath = "/login";
  if (user && user.role) {
    redirectPath = "/";
  }

  // Show "not authenticated" message for unauthorized access
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You are not authorized to access this page.
        </p>
        <Navigate to={redirectPath} replace />
      </div>
    </div>
  );
}
