import "./global.css";

import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUser } from "./context/UserContext";

// Component to handle role-based redirects
function RoleBasedRedirect() {
  const { user } = useUser();

  if (user?.role === "dept" || user?.role === "dept_staff") {
    return <Navigate to="/dashboard" replace />;
  }

  // For other roles, redirect to home page
  return <Navigate to="/home" replace />;
}

// Pages
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Issues from "./pages/Issues";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminConstituencies from "./pages/AdminConstituencies";
import AdminMLA from "./pages/AdminMLA";
import AdminDepartment from "./pages/AdminDepartment";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Define routes using Data Router API with v7 future flags
const router = createBrowserRouter([
  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  // Protected routes
  {
    path: "/",
    element: (
      <ProtectedRoute
        allowedRoles={["dept", "dept_staff", "mlastaff", "citizen", "admin"]}
      >
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["dept", "dept_staff"]}>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute allowedRoles={["dept", "dept_staff"]}>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/issues",
    element: (
      <ProtectedRoute
        allowedRoles={["dept", "dept_staff", "mlastaff", "citizen", "admin"]}
      >
        <Issues />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute
        allowedRoles={["dept", "dept_staff", "mlastaff", "citizen", "admin"]}
      >
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/constituencies",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminConstituencies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/mla",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminMLA />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/department",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDepartment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute
        allowedRoles={["dept", "dept_staff", "mlastaff", "citizen", "admin"]}
      >
        <Settings />
      </ProtectedRoute>
    ),
  },

  // 404
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <div className="App">
            <RouterProvider router={router} />
            <Toaster />
          </div>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
