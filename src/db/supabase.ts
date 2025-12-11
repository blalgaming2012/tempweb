// الكود لملف supabase.ts

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// 💡 ملاحظة: تأكد من أن طريقة جلب متغيرات البيئة (URL و ANON_KEY) صحيحة في مشروعك.
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL; 
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Key not found in environment variables.');
}

// إنشاء عميل Supabase وتصديره
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// --------------------------------------------------------------------
// الدالة الجديدة: جلب دور المستخدم من جدول 'profiles'
// --------------------------------------------------------------------

export async function getUserRole(): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return 'guest'; 
    }

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('role') 
      .eq('id', user.id) 
      .single(); 

    if (error || !profileData) {
      console.error('Error fetching user role or profile not found:', error);
      return 'user';
    }

    return profileData.role || 'user'; 

  } catch (e) {
    console.error('Unexpected error fetching role:', e);
    return 'user';
  }
}