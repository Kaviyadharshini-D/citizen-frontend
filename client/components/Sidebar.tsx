import { Home, Flag, BarChart3, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/", active: location.pathname === "/" },
    { icon: Flag, label: "Issues", path: "/issues", active: location.pathname === "/issues" },
    { icon: BarChart3, label: "Analytics", path: "/analytics", active: location.pathname === "/analytics" },
    { icon: FileText, label: "Reports", path: "#", active: false },
    { icon: Settings, label: "Settings", path: "#", active: false },
  ];

  return (
    <div className="w-80 min-h-screen bg-dashboard-bg flex flex-col lg:flex hidden">
      <div className="p-4 flex-1">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/dd574254d520b2926427eec623a82531a0d2be4d?width=80"
              alt="Aisha Sharma"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-dashboard-text-primary font-medium text-base">
              Aisha Sharma
            </div>
            <div className="text-dashboard-text-secondary text-sm">
              MLA, Ward 14
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
