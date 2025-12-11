// src/types/types.ts

// 1. تعريف واجهة المستخدم (Profile)
// بناءً على جدول profiles لديك
export interface Profile {
  id: string; // auth.uid()
  username: string; 
  email: string;
  role: 'admin' | 'user' | 'guest'; // الأدوار الرئيسية
  created_at: string; 
  // أضف أي أعمدة أخرى مثل avatar_url أو phone_number إذا كانت موجودة في جدول profiles
}

// 2. تعريف واجهة الطلبات (Order)
// بناءً على جدول orders الذي قمت بإنشائه
export interface Order {
  id: string; // UUID
  user_id: string; // Foreign Key لـ Profile.id
  
  // 🚨 هام: تحديد جميع حالات الطلب التي تستخدمها لتجنب خطأ TypeScript السابق
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'; 
  
  total_amount: number; // المبلغ الإجمالي
  currency: string; // عملة الدفع
  
  // نوع jsonb لتفاصيل المنتجات داخل الطلب
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  
  stripe_session_id: string | null; // للربط بجلسات Stripe
  created_at: string; // timestamptz
  completed_at: string | null; // وقت الإكمال
}

// 3. تعريف واجهة الاستفسارات/الطلبات الخاصة (Request)
// بناءً على استخدامك لجدول requests في Dashboard.tsx
export interface Request {
  id: string;
  user_id: string;
  name: string;
  email: string;
  project_description: string;
  status: 'pending' | 'closed' | 'in_review'; // أمثلة على حالات Requests
  budget_range: string | null;
  created_at: string;
  // أضف أي أعمدة أخرى موجودة في جدول requests لديك
}