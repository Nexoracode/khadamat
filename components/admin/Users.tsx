
import React, { useState } from 'react';
import { User } from '../../types';

const initialUsers: User[] = [
  { id: 'u1', name: 'مهدی علوی', phone: '۰۹۱۲۱۱۱۱۱۱۱', joinDate: '۱۴۰۳/۰۱/۱۵', status: 'active' },
  { id: 'u2', name: 'سارا رضایی', phone: '۰۹۳۵۲۲۲۲۲۲۲', joinDate: '۱۴۰۳/۰۲/۱۰', status: 'active' },
  { id: 'u3', name: 'جواد یساری', phone: '۰۹۱۰۰۰۰۳۳۳۳', joinDate: '۱۴۰۳/۰۲/۲۵', status: 'inactive' },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', phone: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const u: User = {
      id: 'u' + (users.length + 1),
      name: newUser.name,
      phone: newUser.phone,
      joinDate: new Date().toLocaleDateString('fa-IR'),
      status: 'active'
    };
    setUsers([...users, u]);
    setShowModal(false);
    setNewUser({ name: '', phone: '' });
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-3 w-full sm:w-auto">
          <input 
            type="text" placeholder="جستجوی نام یا شماره..." 
            className="w-full sm:w-64 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setShowModal(true)} className="bg-secondary text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap">+ کاربر جدید</button>
        </div>
        <h3 className="text-xl font-bold order-first sm:order-last">مدیریت کاربران</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="px-8 py-4">نام و نام خانوادگی</th>
              <th className="px-8 py-4">شماره همراه</th>
              <th className="px-8 py-4">تاریخ عضویت</th>
              <th className="px-8 py-4">وضعیت</th>
              <th className="px-8 py-4">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.filter(u => u.name.includes(searchTerm) || u.phone.includes(searchTerm)).map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-8 py-4 font-bold text-sm">{u.name}</td>
                <td className="px-8 py-4 font-mono text-sm">{u.phone}</td>
                <td className="px-8 py-4 text-xs text-gray-500">{u.joinDate}</td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {u.status === 'active' ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">👤</button>
                    <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-6">ثبت کاربر جدید</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                type="text" placeholder="نام و نام خانوادگی" required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
              />
              <input 
                type="tel" placeholder="شماره همراه" required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary text-left dir-ltr"
                value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">تایید</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold">لغو</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
