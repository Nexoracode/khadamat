
import React, { useState } from 'react';
import { products as initialProducts } from '../../data';
import { Product } from '../../types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', image: 'https://picsum.photos/id/1/300/300' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      id: 'p' + (products.length + 1),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image
    };
    setProducts([...products, p]);
    setShowModal(false);
    setNewProduct({ name: '', price: '', category: '', description: '', image: 'https://picsum.photos/id/1/300/300' });
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold">مدیریت محصولات</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          + افزودن محصول جدید
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-8 py-4">تصویر</th>
              <th className="px-8 py-4">نام محصول</th>
              <th className="px-8 py-4">دسته‌بندی</th>
              <th className="px-8 py-4">قیمت</th>
              <th className="px-8 py-4">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-4"><img src={p.image} className="w-12 h-12 rounded-lg object-cover" /></td>
                <td className="px-8 py-4 font-bold text-sm">{p.name}</td>
                <td className="px-8 py-4 text-xs text-gray-500">{p.category}</td>
                <td className="px-8 py-4 font-mono text-sm">{p.price.toLocaleString()} تومان</td>
                <td className="px-8 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">✏️</button>
                    <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-6">افزودن محصول جدید</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                type="text" placeholder="نام محصول" required
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="قیمت (تومان)" required
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
                <select 
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="">دسته بندی</option>
                  <option value="ابزارآلات">ابزارآلات</option>
                  <option value="شوینده">شوینده</option>
                  <option value="برقی">برقی</option>
                </select>
              </div>
              <textarea 
                placeholder="توضیحات محصول"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary h-24"
                value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              ></textarea>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">ثبت محصول</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
