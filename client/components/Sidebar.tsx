import { Home, Flag, BarChart3, FileText, Settings } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Flag, label: "Issues", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: FileText, label: "Reports", active: false },
    { icon: Settings, label: "Settings", active: false },
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
          })}
        </nav>
      </div>
    </div>
  );
}
