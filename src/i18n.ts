// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 💡 مفاتيح الترجمة (نصوص التطبيق)
const resources = {
  en: {
    translation: {
      "welcome_message": "Welcome back, {{username}}!",
      "dashboard_title": "Dashboard",
      "orders_tab": "Orders",
      "requests_tab": "Requests",
      "cancel_order": "Cancel Order",
      "retry_payment": "Retry Payment",
      "refresh_status": "Refresh Status",
      "total": "Total",
      "items": "Items:",
      "no_orders": "No orders yet",
      "no_requests": "No requests yet",
      "budget_range": "Budget Range:",
      "project_description": "Project Description:",
      "cancellation_confirm": "Are you sure you want to cancel this order? This cannot be undone."
    }
  },
  ar: {
    translation: {
      "welcome_message": "أهلاً بعودتك، {{username}}!",
      "dashboard_title": "لوحة التحكم",
      "orders_tab": "الطلبات",
      "requests_tab": "الاستفسارات",
      "cancel_order": "إلغاء الطلب",
      "retry_payment": "إعادة محاولة الدفع",
      "refresh_status": "تحديث الحالة",
      "total": "الإجمالي",
      "items": "العناصر:",
      "no_orders": "لا توجد طلبات بعد",
      "no_requests": "لا توجد استفسارات بعد",
      "budget_range": "نطاق الميزانية:",
      "project_description": "وصف المشروع:",
      "cancellation_confirm": "هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
    }
  }
};

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // اللغة الاحتياطية
    lng: 'ar', // ابدأ بالعربية كافتراضي للتجربة، يمكنك حذف هذا السطر للاعتماد على المتصفح
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    interpolation: {
      escapeValue: false
    },
    // تحديد اتجاه النص (RTL/LTR)
    react: {
        useSuspense: false,
    }
  });

export default i18n;