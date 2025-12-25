
import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (success: boolean, isAdmin: boolean) => void;
  onClose: () => void;
  initialIsAdmin?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose, initialIsAdmin = false }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      setError('لطفا شماره همراه معتبر وارد کنید');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setError('');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234') {
      setError('کد تایید اشتباه است (از 1234 استفاده کنید)');
      return;
    }
    setLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      onLogin(true, initialIsAdmin);
      onClose();
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(true, initialIsAdmin);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            {initialIsAdmin ? 'ورود به پنل مدیریت' : 'خوش آمدید'}
          </h2>
          <p className="text-gray-500 text-sm">
            {step === 'phone' ? 'برای ادامه شماره همراه خود را وارد کنید' : `کد ارسال شده به ${phone} را وارد کنید`}
          </p>
        </div>

        {step === 'phone' && (
          <div className="space-y-6">
            {/* Google Login Option */}
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-3.5 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
              ورود با حساب گوگل
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs">یا شماره همراه</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <form onSubmit={handleSendPhone} className="space-y-4">
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all text-left dir-ltr" 
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
              </div>
              {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'ارتباط با خدمات همراه'}
              </button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-center gap-3 dir-ltr">
              <input 
                type="text" 
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
                disabled={loading}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl px-6 py-4 text-center text-2xl font-black tracking-[1rem] outline-none transition-all"
                placeholder="----"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            
            <div className="space-y-3">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-secondary text-white py-4 rounded-2xl font-black shadow-xl shadow-secondary/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'تایید و ورود'}
              </button>
              <button 
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors"
              >
                ویرایش شماره همراه
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-[10px] text-gray-400 leading-relaxed">
          با ورود به خدمات همراه، شما <span className="underline cursor-pointer">قوانین و مقررات</span> و <span className="underline cursor-pointer">حریم خصوصی</span> ما را می‌پذیرید.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
