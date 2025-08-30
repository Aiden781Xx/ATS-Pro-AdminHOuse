import React from 'react';
import { LayoutDashboard, Users, Upload, FileText, User } from 'lucide-react';
import { NotificationCenter } from './ui/NotificationCenter';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'bulk', label: 'Bulk Operations', icon: Upload },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <User className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ATS Pro</h1>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            <NotificationCenter />
          </div>
        </div>
      </div>
    </nav>
  );
};