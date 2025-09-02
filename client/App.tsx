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

// Pages
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Issues from "./pages/Issues";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

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
const router = createBrowserRouter(
  [
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
      path: "/settings",
      element: (
        <ProtectedRoute
          allowedRoles={["dept", "dept_staff", "mlastaff", "citizen", "admin"]}
        >
          <Settings />
        </ProtectedRoute>
      ),
    },

    // Redirects
    { path: "/dashboard", element: <Navigate to="/" replace /> },

    // 404
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <div className="App">
            <RouterProvider
              router={router}
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            />
            <Toaster />
          </div>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
