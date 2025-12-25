
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatBot from './components/ChatBot';
import ProductList from './components/ProductList';
import TopSpecialists from './components/TopSpecialists';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import { Page, CartItem, Product, Location } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);

  useEffect(() => {
    // Request location on app start
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log("Location set:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Location permission denied or error:", error);
        }
      );
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleLogin = (success: boolean, adminRole: boolean) => {
    setIsLoggedIn(success);
    setIsAdmin(adminRole);
    if (adminRole) {
      setActivePage(Page.Admin);
    }
  };

  const triggerLogin = (admin: boolean = false) => {
    setLoginAsAdmin(admin);
    setShowLoginModal(true);
  };

  const renderContent = () => {
    switch (activePage) {
      case Page.Home:
        return (
          <>
            {/* Hero Section */}
            <section className="relative py-20 bg-gray-50 overflow-hidden">
              <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-right">
                  <span className="inline-block px-4 py-1 bg-primary/20 text-primary font-bold rounded-full mb-4 text-sm">
                    درخواست از شما، خدمت از ما
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                    خدمات <span className="text-primary underline decoration-secondary underline-offset-8">همراه</span> شما
                  </h1>
                  <p className="text-lg text-gray-600 mb-8 max-w-xl">
                    به منطقه جدید خوش آمدید! ما اینجا هستیم تا دغدغه‌های فنی خانه شما را در کمترین زمان با متخصصین محلی رفع کنیم.
                    {userLocation ? (
                      <span className="block mt-2 text-primary font-bold text-sm">📍 مکان شما شناسایی شد. بهترین متخصصین نزدیک به شما معرفی خواهند شد.</span>
                    ) : (
                      <span className="block mt-2 text-gray-400 text-sm">برای یافتن متخصصین نزدیک، اجازه دسترسی به مکان را صادر کنید.</span>
                    )}
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => triggerLogin(false)}
                      className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-secondary/20 hover-secondary transition-all"
                    >
                      شروع مشاوره
                    </button>
                    <button className="bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all">
                      لیست متخصصین
                    </button>
                  </div>
                </div>
                <div className="flex-1 w-full max-w-lg">
                  <ChatBot 
                    addToCart={addToCart} 
                    userLocation={userLocation}
                    isLoggedIn={isLoggedIn}
                    onLoginRequest={() => triggerLogin(false)}
                  />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-20 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -ml-48 blur-3xl"></div>
            </section>

            <TopSpecialists />
            <ProductList addToCart={addToCart} />

            {/* Why Us Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">چرا خدمات همراه؟</h2>
                  <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'دستیار هوشمند', icon: '🤖', desc: 'استفاده از آخرین تکنولوژی هوش مصنوعی برای تشخیص سریع مشکلات شما.' },
                    { title: 'متخصصین تأیید شده', icon: '✅', desc: 'تمامی متخصصین ما از فیلترهای مهارتی و اخلاقی عبور کرده‌اند.' },
                    { title: 'پشتیبانی ۲۴ ساعته', icon: '📞', desc: 'در هر ساعت از شبانه‌روز، تیم ما آماده پاسخگویی به شماست.' },
                  ].map((item, i) => (
                    <div key={i} className="p-8 border border-gray-100 rounded-3xl text-center hover:border-primary transition-colors">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      case Page.Admin:
        return <AdminPanel />;
      case Page.About:
        return (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold mb-8">درباره خدمات همراه</h1>
            <p className="max-w-2xl mx-auto text-gray-600 leading-loose">
              شرکت خدمات محلی هوشمند مداحی با هدف ایجاد یک پلتفرم نوین برای تسهیل امور فنی ساختمان در سال ۱۴۰۳ تأسیس شد. ما بر این باوریم که دسترسی به متخصصین مطمئن و محلی نباید دشوار باشد. با استفاده از هوش مصنوعی جمینای گوگل، ما تجربه متفاوتی از عیب‌یابی و تعمیرات را برای شما رقم می‌زنیم.
            </p>
          </div>
        );
      default:
        return (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold mb-8 text-gray-300">این بخش به زودی فعال می‌شود</h1>
            <button onClick={() => setActivePage(Page.Home)} className="bg-primary text-white px-6 py-2 rounded-lg">بازگشت به خانه</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activePage={activePage} 
        setPage={setActivePage} 
        cart={cart} 
        updateQuantity={updateQuantity}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLoginClick={triggerLogin}
        onLogout={() => { setIsLoggedIn(false); setIsAdmin(false); setActivePage(Page.Home); }}
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer />

      {showLoginModal && (
        <LoginModal 
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
          initialIsAdmin={loginAsAdmin}
        />
      )}
    </div>
  );
};

export default App;
