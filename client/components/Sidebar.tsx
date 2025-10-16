import {
  Home,
  Flag,
  BarChart3,
  FileText,
  Settings,
  User,
  Shield,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

export function Sidebar() {
  const location = useLocation();
  const { user } = useUser();
  const { isDark } = useTheme();

  // Role-based navigation items
  const getNavItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: "Dashboard",
        path: "/",
        active: location.pathname === "/",
      },
    ];

    switch (user?.role) {
      case "mlastaff":
        return [
          ...baseItems,
          {
            icon: Flag,
            label: "Issues",
            path: "/issues",
            active: location.pathname === "/issues",
          },
          {
            icon: FileText,
            label: "Reports",
            path: "/reports",
            active: location.pathname === "/reports",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/settings",
            active: location.pathname === "/settings",
          },
        ];
      case "dept":
      case "dept_staff":
        return [
          {
            icon: Home,
            label: "Dashboard",
            path: "/dashboard",
            active:
              location.pathname === "/dashboard" ||
              location.pathname === "/analytics",
          },
          {
            icon: Flag,
            label: "Issues",
            path: "/issues",
            active: location.pathname === "/issues",
          },
          {
            icon: FileText,
            label: "Reports",
            path: "/reports",
            active: location.pathname === "/reports",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/settings",
            active: location.pathname === "/settings",
          },
        ];
      case "admin":
        return [
          {
            icon: Home,
            label: "Dashboard",
            path: "/admin",
            active: location.pathname === "/admin",
          },
          {
            icon: Flag,
            label: "Constituencies",
            path: "/admin/constituencies",
            active: location.pathname === "/admin/constituencies",
          },
          {
            icon: ShieldCheck,
            label: "MLA",
            path: "/admin/mla",
            active: location.pathname === "/admin/mla",
          },
          {
            icon: Building2,
            label: "Department",
            path: "/admin/department",
            active: location.pathname === "/admin/department",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/settings",
            active: location.pathname === "/settings",
          },
        ];
      case "citizen":
        return [
          ...baseItems,
          {
            icon: Flag,
            label: "Issues",
            path: "/issues",
            active: location.pathname === "/issues",
          },
          {
            icon: FileText,
            label: "Reports",
            path: "/reports",
            active: location.pathname === "/reports",
          },
          {
            icon: Settings,
            label: "Settings",
            path: "/settings",
            active: location.pathname === "/settings",
          },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "mlastaff":
        return <Building2 className="w-4 h-4" />;
      case "dept":
      case "dept_staff":
        return <Shield className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "citizen":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "mlastaff":
        return "from-blue-500 to-indigo-600";
      case "dept":
      case "dept_staff":
        return "from-emerald-500 to-teal-600";
      case "admin":
        return "from-purple-500 to-pink-600";
      case "citizen":
        return "from-orange-500 to-red-600";
      default:
        return "from-slate-500 to-gray-600";
    }
  };

  return (
    <div className="w-80 h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-xl sticky top-0 left-0 z-50 transition-colors duration-300">
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent transition-colors duration-300">
                CitiZen
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
                Community Platform
              </p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 overflow-hidden flex items-center justify-center transition-colors duration-300">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-slate-500 dark:text-slate-400" />
                )}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r ${getRoleColor(user?.role || "")} flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800`}
              >
                {getRoleIcon(user?.role || "")}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate transition-colors duration-300">
                {user?.name || "User"}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs font-medium transition-colors duration-300">
                {user?.role
                  ? user.role === "mlastaff"
                    ? "Member of Legislative Assembly"
                    : user.role === "dept"
                      ? "Department Officer"
                      : user.role === "dept_staff"
                        ? "Department Staff"
                        : user.role === "admin"
                          ? "Administrator"
                          : user.role === "citizen"
                            ? "Citizen"
                            : user.position || "User"
                  : "Loading..."}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            if (item.path === "#") {
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    item.active
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="pt-6">
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-4 transition-colors duration-300">
            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-2 transition-colors duration-300">
              Platform Status
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold transition-colors duration-300">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
