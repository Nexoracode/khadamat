
import React from 'react';
import { specialists } from '../../data';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'کل متخصصان', value: specialists.length, icon: '👷', color: 'from-blue-500 to-blue-600' },
          { label: 'کل کاربران', value: '۱,۲۴۰', icon: '👥', color: 'from-purple-500 to-purple-600' },
          { label: 'محصولات فروخته شده', value: '۸۵', icon: '📦', color: 'from-orange-500 to-orange-600' },
          { label: 'مبلغ کل فروش', value: '۱۲,۴۰۰,۰۰۰', icon: '💰', color: 'from-emerald-500 to-emerald-600', unit: 'تومان' },
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-[2rem] text-white shadow-lg shadow-black/5 relative overflow-hidden group`}>
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 group-hover:scale-110 transition-transform">{stat.icon}</div>
            <p className="text-sm font-medium opacity-80 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{stat.value}</span>
              {stat.unit && <span className="text-xs">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-8">نمودار فروش ۷ روز اخیر</h3>
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[60, 40, 85, 30, 95, 55, 75].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div 
                  className="w-full bg-primary/20 rounded-t-xl relative group-hover:bg-primary transition-all duration-500"
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {val * 100} هزار
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-bold">روز {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-8 w-full text-right">دسته‌بندی خدمات</h3>
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-100" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray="40, 100" />
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-secondary" strokeWidth="3" strokeDasharray="25, 100" strokeDashoffset="-40" />
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-500" strokeWidth="3" strokeDasharray="35, 100" strokeDashoffset="-65" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-800">۱۰۰٪</span>
              <span className="text-[10px] text-gray-400">توزیع بازار</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 w-full">
            <div className="flex items-center gap-2 text-xs"><span className="w-3 h-3 bg-primary rounded-full"></span> برق‌کاری</div>
            <div className="flex items-center gap-2 text-xs"><span className="w-3 h-3 bg-secondary rounded-full"></span> لوله‌کشی</div>
            <div className="flex items-center gap-2 text-xs"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> نظافت</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
