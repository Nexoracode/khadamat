
import React, { useState } from 'react';
import { Page, CartItem } from '../types';

interface HeaderProps {
  activePage: Page;
  setPage: (page: Page) => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLoginClick: (isAdmin: boolean) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activePage, 
  setPage, 
  cart, 
  updateQuantity, 
  isLoggedIn, 
  isAdmin,
  onLoginClick, 
  onLogout 
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-reverse space-x-4 cursor-pointer" onClick={() => setPage(Page.Home)}>
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-2xl font-bold">
            ه
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">خدمات همراه</h1>
            <p className="text-xs text-gray-500 hidden sm:block">درخواست از شما، خدمت از ما</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-reverse space-x-8 font-medium">
          {[
            { label: 'خانه', page: Page.Home },
            { label: 'درباره ما', page: Page.About },
            { label: 'سایر خدمات', page: Page.Services },
            { label: 'همکاری', page: Page.Partnership },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              className={`transition-colors hover:text-primary ${
                activePage === item.page ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => setPage(Page.Admin)}
              className={`transition-colors font-bold ${
                activePage === Page.Admin ? 'text-secondary border-b-2 border-secondary' : 'text-secondary/70'
              }`}
            >
              پنل مدیریت
            </button>
          )}
        </nav>

        <div className="flex items-center space-x-reverse space-x-4">
          {/* Cart */}
          <div 
            className="relative h-20 flex items-center"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            <div className={`absolute left-0 top-full pt-2 w-72 transition-all duration-300 transform origin-top-left ${isCartOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
              <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-4">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">سبد خرید</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">سبد خرید شما خالی است</p>
                ) : (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold line-clamp-1">{item.name}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{item.price.toLocaleString()} تومان</span>
                            <div className="flex items-center space-x-reverse space-x-2">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs">-</button>
                              <span className="text-xs font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold">جمع کل:</span>
                      <span className="text-secondary font-bold">{totalPrice.toLocaleString()} تومان</span>
                    </div>
                    <button className="w-full bg-secondary text-white py-2 rounded-lg font-bold hover-secondary transition-colors">
                      تسویه حساب
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isLoggedIn && (
              <button 
                onClick={() => onLoginClick(true)}
                className="hidden sm:block text-gray-500 hover:text-secondary text-xs font-bold transition-colors"
              >
                ورود ادمین
              </button>
            )}

            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="text-gray-600 hover:text-red-500 font-bold text-sm border-r pr-4 border-gray-200"
              >
                خروج
              </button>
            ) : (
              <button 
                onClick={() => onLoginClick(false)}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                ورود / ثبت‌نام
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
