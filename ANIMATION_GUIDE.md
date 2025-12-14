# دليل الرسوم المتحركة - Tempweb

## نظرة عامة
هذا الدليل يشرح جميع الرسوم المتحركة والتأثيرات التفاعلية المتوفرة في Tempweb.

## الرسوم المتحركة الأساسية

### 1. Fade Animations (ظهور تدريجي)

#### animate-fade-in-up
```tsx
<div className="animate-fade-in-up">
  المحتوى يظهر من الأسفل
</div>
```
- **الاستخدام**: عناصر تظهر من الأسفل للأعلى
- **المدة**: 0.6 ثانية
- **التأثير**: opacity من 0 إلى 1، translateY من 20px إلى 0

#### animate-fade-in-down
```tsx
<div className="animate-fade-in-down">
  المحتوى يظهر من الأعلى
</div>
```
- **الاستخدام**: عناصر تظهر من الأعلى للأسفل
- **المدة**: 0.6 ثانية
- **التأثير**: opacity من 0 إلى 1، translateY من -20px إلى 0

### 2. Scale Animation (تكبير)

#### animate-scale-in
```tsx
<div className="animate-scale-in">
  المحتوى يتكبر عند الظهور
</div>
```
- **الاستخدام**: بطاقات، نوافذ منبثقة
- **المدة**: 0.5 ثانية
- **التأثير**: scale من 0.9 إلى 1

### 3. Slide Animations (انزلاق)

#### animate-slide-in-right
```tsx
<div className="animate-slide-in-right">
  المحتوى ينزلق من اليمين
</div>
```
- **الاستخدام**: عناصر جانبية (RTL: من اليمين)
- **المدة**: 0.6 ثانية

#### animate-slide-in-left
```tsx
<div className="animate-slide-in-left">
  المحتوى ينزلق من اليسار
</div>
```
- **الاستخدام**: عناصر جانبية (RTL: من اليسار)
- **المدة**: 0.6 ثانية

### 4. Continuous Animations (رسوم متحركة مستمرة)

#### animate-pulse-glow
```tsx
<div className="animate-pulse-glow">
  توهج نابض مستمر
</div>
```
- **الاستخدام**: عناصر مهمة، أزرار رئيسية
- **المدة**: 2 ثانية (تكرار لا نهائي)
- **التأثير**: box-shadow يتغير بين حالتين

#### animate-bounce-subtle
```tsx
<div className="animate-bounce-subtle">
  ارتداد خفيف
</div>
```
- **الاستخدام**: أيقونات، مؤشرات
- **المدة**: 2 ثانية (تكرار لا نهائي)
- **التأثير**: translateY بين 0 و -5px

#### animate-spin
```tsx
<div className="animate-spin">
  دوران مستمر
</div>
```
- **الاستخدام**: مؤشرات التحميل
- **المدة**: 1 ثانية (تكرار لا نهائي)
- **التأثير**: rotate 360 درجة

## التأخيرات المتدرجة (Stagger)

### استخدام التأخيرات
```tsx
<div className="animate-fade-in-up stagger-1">عنصر 1</div>
<div className="animate-fade-in-up stagger-2">عنصر 2</div>
<div className="animate-fade-in-up stagger-3">عنصر 3</div>
<div className="animate-fade-in-up stagger-4">عنصر 4</div>
```

### التأخيرات المتاحة
- `stagger-1`: تأخير 0.1 ثانية
- `stagger-2`: تأخير 0.2 ثانية
- `stagger-3`: تأخير 0.3 ثانية
- `stagger-4`: تأخير 0.4 ثانية

## تأثيرات Hover التفاعلية

### 1. hover-lift
```tsx
<Card className="hover-lift">
  البطاقة ترتفع عند التمرير
</Card>
```
- **التأثير**: translateY(-8px) + scale(1.02)
- **الظل**: يزداد عمق الظل
- **الاستخدام**: بطاقات، عناصر قابلة للنقر

### 2. hover-glow
```tsx
<Button className="hover-glow">
  توهج عند التمرير
</Button>
```
- **التأثير**: إطار متوهج بلون العلامة التجارية
- **الاستخدام**: أزرار، حقول إدخال

### 3. hover-scale
```tsx
<div className="hover-scale">
  تكبير خفيف عند التمرير
</div>
```
- **التأثير**: scale(1.05)
- **الاستخدام**: أيقونات، شعارات

### 4. card-hover (قديم - لا يزال مدعوماً)
```tsx
<Card className="card-hover">
  تأثير بطاقة تقليدي
</Card>
```
- **التأثير**: translateY(-4px)
- **الاستخدام**: بطاقات بسيطة

## تأثيرات خاصة

### 1. Parallax Background
```tsx
<div className="parallax-bg" />
```
- **الاستخدام**: خلفية متحركة للصفحات
- **التأثير**: حركة بطيئة ومستمرة
- **الموضع**: fixed، z-index: -1

### 2. Gradient Text
```tsx
<h1 className="gradient-text">
  نص بتدرج لوني
</h1>
```
- **التأثير**: تدرج من primary إلى primary-glow
- **الاستخدام**: عناوين رئيسية، شعارات

### 3. Shimmer Effect
```tsx
<div className="shimmer">
  تأثير لمعان للتحميل
</div>
```
- **الاستخدام**: هياكل التحميل (Skeleton)
- **التأثير**: موجة لامعة تتحرك

## أمثلة عملية

### مثال 1: بطاقة إحصائيات متحركة
```tsx
<Card className="hover-lift animate-fade-in-up stagger-1">
  <CardHeader>
    <CardTitle>إجمالي الطلبات</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">150</div>
  </CardContent>
</Card>
```

### مثال 2: زر تفاعلي
```tsx
<Button className="hover-lift hover-glow animate-fade-in-up">
  <Sparkles className="w-4 h-4 animate-bounce-subtle" />
  إنشاء طلب جديد
</Button>
```

### مثال 3: عنوان صفحة
```tsx
<div className="animate-fade-in-down">
  <h1 className="gradient-text flex items-center gap-2">
    <Sparkles className="w-8 h-8 text-primary animate-bounce-subtle" />
    مرحباً بك في Tempweb
  </h1>
</div>
```

### مثال 4: قائمة متدرجة
```tsx
<div className="space-y-4">
  {items.map((item, index) => (
    <Card 
      key={item.id}
      className={`hover-lift animate-fade-in-up stagger-${index + 1}`}
    >
      {item.content}
    </Card>
  ))}
</div>
```

## نصائح للاستخدام

### 1. لا تبالغ في الرسوم المتحركة
- استخدم رسمة واحدة أو اثنتين لكل عنصر
- تجنب الجمع بين رسوم متحركة متعارضة

### 2. استخدم التأخيرات بحكمة
- للعناصر المتعددة، استخدم stagger
- لا تستخدم تأخيرات طويلة جداً

### 3. اختر التأثير المناسب
- **fade-in-up**: للمحتوى الرئيسي
- **scale-in**: للنوافذ المنبثقة
- **slide-in**: للعناصر الجانبية
- **hover-lift**: للبطاقات التفاعلية

### 4. الأداء
- الرسوم المتحركة محسّنة للأداء
- تستخدم GPU acceleration
- لا تؤثر على سرعة التطبيق

## التخصيص

### تعديل المدة
يمكنك تعديل مدة الرسوم المتحركة في `src/index.css`:

```css
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out; /* غيّر 0.6s */
}
```

### إضافة رسمة جديدة
```css
@keyframes my-animation {
  from {
    /* الحالة الأولية */
  }
  to {
    /* الحالة النهائية */
  }
}

.animate-my-animation {
  animation: my-animation 0.5s ease-out;
}
```

## الدعم

جميع الرسوم المتحركة مدعومة في:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera

---

**آخر تحديث**: 14 ديسمبر 2025
**الإصدار**: 1.0.0
