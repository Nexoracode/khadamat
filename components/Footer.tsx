
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t-8 border-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary">خدمات همراه</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              ما در خدمات همراه، پلی هستیم میان شما و بهترین متخصصین محلی. هدف ما این است که هیچ مشکلی در خانه شما بدون راهکار نماند.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">سوالات متداول</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">قوانین و مقررات</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">تماس با ما</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">حریم خصوصی</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">تماس با ما</h3>
            <p className="text-gray-400 text-sm mb-2">تهران، منطقه ۱، خیابان ولیعصر، ساختمان همراه</p>
            <p className="text-gray-400 text-sm mb-2">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
            <p className="text-gray-400 text-sm">ایمیل: info@hamrah.com</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© تمامی حقوق برای شرکت خدمات محلی هوشمند مداحی محفوظ است.</p>
          <div className="flex space-x-reverse space-x-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">اینستاگرام</span>
            <span className="hover:text-white cursor-pointer">تلگرام</span>
            <span className="hover:text-white cursor-pointer">توییتر</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
