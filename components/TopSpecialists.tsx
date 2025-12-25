
import React from 'react';
import { specialists } from '../data';

const TopSpecialists: React.FC = () => {
  // Show top 3 based on rating
  const topSpecialists = [...specialists].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">متخصصان برتر همراه</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            برترین تکنسین‌های منطقه شما که توسط هوش مصنوعی و نظرات کاربران برگزیده شده‌اند.
          </p>
          <div className="w-24 h-1.5 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topSpecialists.map((specialist) => (
            <div key={specialist.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors"></div>
              
              <div className="relative flex flex-col items-center">
                <div className="relative mb-6">
                  <img 
                    src={specialist.image} 
                    alt={specialist.name} 
                    className="w-24 h-24 rounded-3xl object-cover shadow-lg ring-4 ring-white"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-xl shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">{specialist.name}</h3>
                <p className="text-primary font-bold text-sm mb-4">{specialist.expertise}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl font-black text-gray-800">{specialist.rating}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(specialist.rating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-3 rounded-2xl text-center">
                    <p className="text-[10px] text-gray-400 mb-1">منطقه</p>
                    <p className="text-xs font-bold">{specialist.region}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl text-center">
                    <p className="text-[10px] text-gray-400 mb-1">پروژه‌ها</p>
                    <p className="text-xs font-bold">+{Math.floor(Math.random() * 40) + 15}</p>
                  </div>
                </div>

                <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
                  رزرو خدمات سریع
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSpecialists;
