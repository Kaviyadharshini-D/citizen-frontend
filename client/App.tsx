import "./global.css";

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "dept",
                        "dept_staff",
                        "mlastaff",
                        "citizen",
                        "admin",
                      ]}
                    >
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={["dept", "dept_staff"]}>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "dept",
                        "dept_staff",
                        "mlastaff",
                        "citizen",
                        "admin",
                      ]}
                    >
                      <Issues />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "dept",
                        "dept_staff",
                        "mlastaff",
                        "citizen",
                        "admin",
                      ]}
                    >
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "dept",
                        "dept_staff",
                        "mlastaff",
                        "citizen",
                        "admin",
                      ]}
                    >
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* Redirects */}
                <Route
                  path="/dashboard"
                  element={<Navigate to="/" replace />}
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              <Toaster />
            </div>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
