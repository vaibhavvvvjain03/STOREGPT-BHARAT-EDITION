export interface User {
  id: string;
  email: string;
  shop_name: string;
  shop_description?: string;
  preferred_language: string;
  festival_mode_enabled: boolean;
  location?: string;
  upi_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image_url?: string;
  in_store: boolean;
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  user_id: string;
  customer_name: string;
  amount: number;
  entry_type: 'credit' | 'debit';
  notes?: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  visitors: number;
  sales: number;
  date: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  keywords: string[];
  color: string;
  icon: string;
  created_at: string;
}

export interface StoreConfig {
  id: string;
  user_id: string;
  store_url?: string;
  theme_color: string;
  categories: Record<string, unknown>;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, shopName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
