
import React, { useState } from 'react';
import { AdminSection } from '../types';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import Users from './admin/Users';
import Specialists from './admin/Specialists';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'users': return <Users />;
      case 'specialists': return <Specialists />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-gray-50/50">
      {/* Right Sidebar */}
      <aside className="w-72 bg-white border-l border-gray-100 hidden lg:flex flex-col p-6 sticky top-20 h-[calc(100vh-5rem)]">
        <div className="space-y-2 flex-1">
          {[
            { id: 'dashboard', label: 'داشبورد مدیریتی', icon: '📊' },
            { id: 'products', label: 'مدیریت محصولات', icon: '🛒' },
            { id: 'users', label: 'مدیریت کاربران', icon: '👥' },
            { id: 'specialists', label: 'مدیریت متخصصان', icon: '👷' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as AdminSection)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeSection === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="pt-6 border-t border-gray-50">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-[10px] text-gray-400 mb-1 font-bold">ورود به عنوان:</p>
            <p className="text-xs font-black text-gray-800">مدیر کل سیستم</p>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
