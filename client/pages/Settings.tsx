import { Layout } from "../components/Layout";
import { useUser } from "../context/UserContext";

export default function Settings() {
  const { user } = useUser();

  return (
    <Layout>
      <div className="bg-dashboard-bg min-h-screen">
        <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-4">
          {/* Page Header */}
          <div className="px-4 mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-jakarta">
              Settings
            </h1>
          </div>

          {/* Profile Section */}
          <div className="mb-8">
            <div className="px-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-jakarta">
                Profile
              </h2>
            </div>

            <div className="space-y-6 px-4">
              {/* Name Field */}
              <div className="max-w-md">
                <label className="block text-base font-medium text-gray-900 font-jakarta mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 font-jakarta focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email Field */}
              <div className="max-w-md">
                <label className="block text-base font-medium text-gray-900 font-jakarta mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="aisha.sharma@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 font-jakarta focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone Field */}
              <div className="max-w-md">
                <label className="block text-base font-medium text-gray-900 font-jakarta mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+91 98765 43210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 font-jakarta focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="mb-8">
            <div className="px-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-jakarta">
                Account
              </h2>
            </div>

            <div className="space-y-4 px-4">
              {/* Change Password Button */}
              <div>
                <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold font-jakarta hover:bg-gray-200 transition-colors">
                  Change Password
                </button>
              </div>

              {/* Logout Button */}
              <div>
                <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold font-jakarta hover:bg-gray-200 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
