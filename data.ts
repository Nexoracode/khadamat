
import { Specialist, Product } from './types';

export const specialists: Specialist[] = [
  {
    id: 's1',
    name: 'علی کریمی',
    expertise: 'برق‌کار ساختمان',
    region: 'منطقه ۱ و ۲',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    rating: 4.8,
    image: 'https://picsum.photos/id/64/200/200',
    lat: 35.7012,
    lng: 51.3332
  },
  {
    id: 's2',
    name: 'رضا حسینی',
    expertise: 'لوله‌کش و تأسیسات',
    region: 'منطقه ۳ و ۴',
    phone: '۰۹۳۵۰۰۰۱۱۱۱',
    rating: 4.9,
    image: 'https://picsum.photos/id/91/200/200',
    lat: 35.7219,
    lng: 51.3912
  },
  {
    id: 's3',
    name: 'مریم ساداتی',
    expertise: 'تعمیرات لوازم خانگی',
    region: 'کل تهران',
    phone: '۰۹۱۰۰۰۰۲۲۲۲',
    rating: 4.7,
    image: 'https://picsum.photos/id/177/200/200',
    lat: 35.7511,
    lng: 51.4211
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'مجموعه ابزار ۱۲ عددی',
    price: 450000,
    description: 'مناسب برای تعمیرات جزئی منزل و باز و بسته کردن پیچ‌ها.',
    image: 'https://picsum.photos/id/1060/300/300',
    category: 'ابزارآلات'
  },
  {
    id: 'p2',
    name: 'محلول لوله‌بازکن قوی',
    price: 85000,
    description: 'رفع سریع گرفتگی لوله‌های آشپزخانه و حمام.',
    image: 'https://picsum.photos/id/1055/300/300',
    category: 'شوینده'
  },
  {
    id: 'p3',
    name: 'فیوز مینیاتوری ۲۵ آمپر',
    price: 120000,
    description: 'قطعه ضروری برای تابلو برق ساختمان جهت امنیت بیشتر.',
    image: 'https://picsum.photos/id/1070/300/300',
    category: 'برقی'
  }
];
