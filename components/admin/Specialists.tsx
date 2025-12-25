
import React, { useState } from 'react';
import { specialists as initialSpecs } from '../../data';
import { Specialist } from '../../types';

const Specialists: React.FC = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>(initialSpecs);
  const [showModal, setShowModal] = useState(false);
  const [newSpec, setNewSpec] = useState({ name: '', expertise: '', region: '', phone: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const s: Specialist = {
      id: 's' + (specialists.length + 1),
      name: newSpec.name,
      expertise: newSpec.expertise,
      region: newSpec.region,
      phone: newSpec.phone,
      rating: 5.0,
      image: 'https://picsum.photos/id/65/200/200',
      lat: 35.7,
      lng: 51.3
    };
    setSpecialists([...specialists, s]);
    setShowModal(false);
    setNewSpec({ name: '', expertise: '', region: '', phone: '' });
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20">
            <option>همه تخصص‌ها</option>
            <option>برق‌کار</option>
            <option>لوله‌کش</option>
          </select>
          <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold">+ متخصص جدید</button>
        </div>
        <h3 className="text-xl font-bold order-first sm:order-last">مدیریت متخصصین</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="px-8 py-4">نام</th>
              <th className="px-8 py-4">تخصص</th>
              <th className="px-8 py-4">منطقه</th>
              <th className="px-8 py-4">امتیاز</th>
              <th className="px-8 py-4">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {specialists.map(s => (
              <tr key={s.id} className="hover:bg-gray-50/50">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <img src={s.image} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold text-sm">{s.name}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-xs font-bold text-primary">{s.expertise}</td>
                <td className="px-8 py-4 text-xs text-gray-500">{s.region}</td>
                <td className="px-8 py-4 font-bold text-yellow-500">⭐ {s.rating}</td>
                <td className="px-8 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">⚙️</button>
                    <button onClick={() => setSpecialists(specialists.filter(x => x.id !== s.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">❌</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-6">ثبت متخصص جدید</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                type="text" placeholder="نام و نام خانوادگی" required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                value={newSpec.name} onChange={e => setNewSpec({...newSpec, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="تخصص (مثلا: برق‌کار)" required
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  value={newSpec.expertise} onChange={e => setNewSpec({...newSpec, expertise: e.target.value})}
                />
                <input 
                  type="text" placeholder="منطقه فعالیت" required
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  value={newSpec.region} onChange={e => setNewSpec({...newSpec, region: e.target.value})}
                />
              </div>
              <input 
                type="tel" placeholder="شماره تماس" required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-left dir-ltr"
                value={newSpec.phone} onChange={e => setNewSpec({...newSpec, phone: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">تایید و ثبت</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold">بستن</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Specialists;
