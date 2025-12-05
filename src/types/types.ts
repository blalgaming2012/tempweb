export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Request {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  project_description: string;
  budget_range: string | null;
  status: string;
  created_at: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  popular?: boolean;
  badge?: string;
}
