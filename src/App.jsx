import { useState } from 'react';
import { Users, Clock, BarChart3, Settings, LogOut, Menu, X, Home } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-lg border-b border-purple-500/20 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AH</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">AbrO HR</h1>
                <p className="text-xs text-purple-300">Attendance System</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8">
              {['dashboard', 'analytics', 'employees', 'settings'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActivePage(item)}
                  className={`text-sm font-medium transition-all duration-300 ${
                    activePage === item
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="text-white" size={24} />
              ) : (
                <Menu className="text-white" size={24} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden pt-16">
          <div className="bg-slate-800 h-full w-64 shadow-xl p-6">
            {['dashboard', 'analytics', 'employees', 'settings'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActivePage(item);
                  setSidebarOpen(false);
                }}
                className="block w-full text-left py-3 px-4 text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors mb-2"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Dashboard</h2>
          <p className="text-purple-300 text-lg">Welcome back! Here's your attendance overview</p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Present Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500/60 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-green-500/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-green-300 font-semibold">Present Today</h3>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="text-green-400" size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">0</p>
              <p className="text-sm text-green-300/70">+0% from yesterday</p>
            </div>
          </div>

          {/* Absent Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 hover:border-red-500/60 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-red-300 font-semibold">Absent Today</h3>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="text-red-400" size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">0</p>
              <p className="text-sm text-red-300/70">-0% from yesterday</p>
            </div>
          </div>

          {/* On Leave Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/60 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-300 font-semibold">On Leave</h3>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-blue-400" size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">0</p>
              <p className="text-sm text-blue-300/70">Approved leaves</p>
            </div>
          </div>

          {/* Total Employees Card */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 hover:border-purple-500/60 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-purple-300 font-semibold">Total Staff</h3>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-400" size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">0</p>
              <p className="text-sm text-purple-300/70">Active employees</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Coming Soon Features */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-purple-900/50 border border-purple-500/20 p-8 hover:border-purple-500/50 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6">🚀 Features Coming Soon</h3>
            <ul className="space-y-4">
              {[
                { title: 'Attendance Management', desc: 'Easy clock in/out system' },
                { title: 'Shift Management', desc: 'Flexible shift scheduling' },
                { title: 'Real-time Reports', desc: 'Live analytics dashboard' },
                { title: 'Employee Profiles', desc: 'Complete employee database' },
              ].map((feature, idx) => (
                <li key={idx} className="flex gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20 group-hover:bg-purple-500/40 transition-colors">
                      <span className="text-purple-400 text-lg">✓</span>
                    </div>
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform">
                    <p className="text-white font-semibold">{feature.title}</p>
                    <p className="text-gray-400 text-sm mt-1">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-indigo-900/50 border border-indigo-500/20 p-8 hover:border-indigo-500/50 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6">⚡ Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, label: 'Clock In', color: 'green' },
                { icon: Clock, label: 'Clock Out', color: 'red' },
                { icon: Settings, label: 'Settings', color: 'blue' },
                { icon: BarChart3, label: 'Reports', color: 'purple' },
              ].map((action, idx) => {
                const Icon = action.icon;
                const colorClass = {
                  green: 'hover:bg-green-500/20 border-green-500/30',
                  red: 'hover:bg-red-500/20 border-red-500/30',
                  blue: 'hover:bg-blue-500/20 border-blue-500/30',
                  purple: 'hover:bg-purple-500/20 border-purple-500/30',
                }[action.color];

                return (
                  <button
                    key={idx}
                    className={`p-4 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 transition-all duration-300 group ${colorClass}`}
                  >
                    <Icon className="mx-auto mb-2 text-white group-hover:scale-110 transition-transform" size={24} />
                    <p className="text-sm font-medium text-white">{action.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6 text-center">
          <p className="text-gray-300 mb-2">AbrO HR - Employee Attendance Tracking System</p>
          <p className="text-gray-500 text-sm">© 2026 All rights reserved | Made with ❤️ for better attendance management</p>
        </div>
      </main>
    </div>
  );
}

export default App;

// UI/UX Enhanced - Professional Dark Theme
