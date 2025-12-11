// src/types/types.ts

// 1. تعريف واجهة المستخدم (Profile)
export interface Profile {
  id: string; 
  username: string; 
  email: string;
  role: 'admin' | 'user' | 'guest'; 
  created_at: string; 
}

// 2. تعريف واجهة الطلبات (Order)
export interface Order {
  id: string; // UUID
  user_id: string; // Foreign Key
  
  // 🚨 حل خطأ TypeScript: جميع الحالات يجب أن تكون هنا
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'; 
  
  total_amount: number; 
  currency: string; 
  
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  
  stripe_session_id: string | null; 
  created_at: string; 
  completed_at: string | null; 
}

// 3. تعريف واجهة الاستفسارات (Request)
export interface Request {
  id: string;
  user_id: string;
  name: string;
  email: string;
  project_description: string;
  status: 'pending' | 'closed' | 'in_review';
  budget_range: string | null;
  created_at: string;
}