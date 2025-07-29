import { Home, Flag, BarChart3, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  // Role-based navigation items
  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Dashboard", path: "/", active: location.pathname === "/" },
    ];

    switch (user.role) {
      case 'MLA':
        return [
          ...baseItems,
          { icon: Flag, label: "Issues", path: "/issues", active: location.pathname === "/issues" },
          { icon: BarChart3, label: "Analytics", path: "/analytics", active: location.pathname === "/analytics" },
          { icon: FileText, label: "Reports", path: "/reports", active: location.pathname === "/reports" },
          { icon: Settings, label: "Settings", path: "/settings", active: location.pathname === "/settings" },
        ];
      case 'Department':
        return [
          ...baseItems,
          { icon: BarChart3, label: "Analytics", path: "/analytics", active: location.pathname === "/analytics" },
          { icon: Settings, label: "Settings", path: "/settings", active: location.pathname === "/settings" },
        ];
      case 'Normal User':
        return [
          ...baseItems,
          { icon: BarChart3, label: "Analytics", path: "/analytics", active: location.pathname === "/analytics" },
          { icon: FileText, label: "Reports", path: "/reports", active: location.pathname === "/reports" },
          { icon: Settings, label: "Settings", path: "/settings", active: location.pathname === "/settings" },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="w-80 min-h-screen bg-gray-100 flex flex-col">
      <div className="p-4 flex-1">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-dashboard-text-primary font-medium text-base">
              {user.name}
            </div>
            <div className="text-dashboard-text-secondary text-sm">
              {user.position}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.path === "#") {
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    item.active
                      ? "bg-dashboard-accent text-dashboard-text-primary"
                      : "text-dashboard-text-primary hover:bg-dashboard-accent"
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-dashboard-accent text-dashboard-text-primary"
                    : "text-dashboard-text-primary hover:bg-dashboard-accent"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
