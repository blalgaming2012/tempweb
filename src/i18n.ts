// src/i18n.ts (الإعداد النهائي لدعم اللغات العالمية)

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend'; // 💡 يستخدم لتحميل الملفات من مسار URL

i18n
  .use(HttpBackend) // يطلب من i18next تحميل ملفات الترجمة من الخادم (ملفات JSON)
  .use(LanguageDetector) // يقوم بالكشف التلقائي للغة المستخدم من المتصفح/النظام
  .use(initReactI18next)
  .init({
    // لا نضع الـ resources هنا، بل نترك الـ backend يقوم بتحميلها
    
    fallbackLng: 'en', // اللغة الافتراضية إذا لم يتم العثور على ترجمة
    debug: false, // يمكن تفعيله لرؤية عملية الترجمة في Console
    
    // إعدادات Backend: يحدد المسار الذي سيتم التحميل منه
    backend: {
      // الصيغة: /locales/ [كود اللغة] / [اسم الملف].json
      loadPath: '/locales/{{lng}}/{{ns}}.json', 
    },
    
    detection: {
      // ترتيب البحث عن اللغة: الكوكيز، ثم التخزين المحلي، ثم إعدادات المتصفح
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },

    ns: ['translation'], // مساحة الأسماء المستخدمة
    defaultNS: 'translation', 

    interpolation: {
      escapeValue: false
    },
    react: {
        useSuspense: false,
    }
  });

export default i18n;