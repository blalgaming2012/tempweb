// هذا مثال فقط - استخدمه لتطبيق الكلاسات في المكون الخاص بك
const HomepageContent = () => {
  return (
    // 1. العنصر الخارجي يستخدم الخلفية المتفاعلة (Parallax)
    <div className="parallax-bg min-h-screen"> 
      
      {/* 2. طبقة المحتوى: نعطيها خلفية شبه شفافة (90%) مع تأثير ضبابي (Blur) 
           لضمان أن النص مقروء في الوضع الداكن والساطع. */}
      <div className="min-h-screen p-8 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm">
        
        {/* 3. تطبيق خط Montserrat على العناوين الكبيرة */}
        <h1 className="text-5xl font-heading font-extrabold mb-4 text-gray-900 dark:text-white">
          Professional Web Development Services
        </h1>
        
        {/* 4. تطبيق خط Cairo على النصوص العادية */}
        <p className="text-xl font-sans mb-8 max-w-lg text-gray-700 dark:text-gray-300">
          Transform your ideas into stunning websites with our expert HTML/CSS/JS development services
        </p>

        <div className="flex space-x-4">
            {/* الأزرار العادية تستخدم الخط الافتراضي (Cairo) */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                View Packages
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition dark:bg-gray-700 dark:text-white">
                Request Quote
            </button>
        </div>

      </div>
      
      {/* 5. محتوى إضافي أسفل الشاشة لرؤية تأثير التمرير (Parallax) بوضوح */}
      <div className="min-h-[50vh] bg-gray-100 dark:bg-gray-800 p-8">
          <h2 className="text-3xl font-heading text-gray-900 dark:text-white">Our Services Continue Below...</h2>
          <p className="font-sans mt-4 text-gray-700 dark:text-gray-300">Scroll up and down to see the background image remain fixed.</p>
      </div>

    </div>
  );
};