
export interface Location {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Specialist {
  id: string;
  name: string;
  expertise: string;
  region: string;
  phone: string;
  rating: number;
  image: string;
  lat: number;
  lng: number;
  distance?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  audioUrl?: string;
  isVoiceInput?: boolean;
  recommendation?: {
    type: 'specialist' | 'product';
    data: Specialist | Product;
  };
}

export enum Page {
  Home = 'home',
  About = 'about',
  Services = 'services',
  Partnership = 'partnership',
  Admin = 'admin'
}

export type AdminSection = 'dashboard' | 'products' | 'users' | 'specialists';
