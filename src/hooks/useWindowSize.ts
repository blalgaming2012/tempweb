// src/hooks/useWindowSize.ts

import { useState, useEffect } from 'react';

// تعريف الواجهة (Interface) لبيانات العرض والارتفاع
interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Hook مخصص لقراءة أبعاد نافذة المتصفح بشكل مستمر.
 * * @returns {WindowSize} كائن يحتوي على عرض وارتفاع النافذة.
 */
export function useWindowSize(): WindowSize {
  // تعريف حالة العرض والارتفاع الأولية
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // الدالة التي تقوم بتحديث الحالة عند تغيير حجم النافذة
    function handleResize() {
      setWindowSize({
        width: window.innerWidth, // عرض النافذة
        height: window.innerHeight, // ارتفاع النافذة
      });
    }

    // إضافة المستمع (Listener) عند تحميل المكون
    window.addEventListener('resize', handleResize);

    // استدعاء الدالة مرة واحدة لتعيين الأبعاد الأولية عند التحميل
    handleResize();

    // إزالة المستمع عند إزالة المكون (لتحسين الأداء)
    return () => window.removeEventListener('resize', handleResize);
  }, []); // تشغيل الـ Effect مرة واحدة عند التحميل

  return windowSize;
}