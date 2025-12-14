import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, ClipboardList, Shield, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="parallax-bg" />
      
      {/* Hero Section */}
      <section className="container py-20 animate-fade-in-down">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-glow rounded-3xl flex items-center justify-center animate-pulse-glow">
              <Zap className="w-16 h-16 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-heading font-bold gradient-text flex items-center justify-center gap-3 flex-wrap">
            <Sparkles className="w-12 h-12 text-primary animate-bounce-subtle" />
            Tempweb
            <Sparkles className="w-12 h-12 text-primary animate-bounce-subtle" />
          </h1>
          
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
            نظام إدارة الخدمات والعمال التفاعلي
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            منصة متكاملة وحديثة لإدارة طلبات الخدمة، تنظيم المهام، ومتابعة أداء العمال بكفاءة عالية
          </p>
          
          <div className="flex gap-4 justify-center pt-6 flex-wrap">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="hover-lift text-lg px-8 py-6">
                  <ArrowLeft className="w-5 h-5 ml-2" />
                  الذهاب إلى لوحة التحكم
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" className="hover-lift text-lg px-8 py-6">
                    <Zap className="w-5 h-5 ml-2" />
                    تسجيل الدخول
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="hover-lift text-lg px-8 py-6">
                  <Sparkles className="w-5 h-5 ml-2" />
                  معرفة المزيد
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            المميزات الرئيسية
          </h2>
          <p className="text-muted-foreground text-lg">
            كل ما تحتاجه لإدارة خدماتك بكفاءة
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover-lift animate-fade-in-up stagger-1">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>إدارة طلبات الخدمة</CardTitle>
              <CardDescription>
                نظام متكامل لإنشاء ومتابعة طلبات الخدمة مع إمكانية تعيين العمال وتحديث الحالات
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>إدارة العمال</CardTitle>
              <CardDescription>
                تنظيم وتوزيع المهام على العمال مع متابعة الأداء والإنتاجية بشكل دقيق
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-3">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>أمان عالي</CardTitle>
              <CardDescription>
                نظام صلاحيات متقدم يضمن وصول كل مستخدم للبيانات المخصصة له فقط
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-1">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>واجهة تفاعلية</CardTitle>
              <CardDescription>
                تصميم عصري مع رسوم متحركة سلسة وتأثيرات تفاعلية لتجربة مستخدم مميزة
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>متابعة فورية</CardTitle>
              <CardDescription>
                تحديثات لحظية لحالة الطلبات والمهام مع إحصائيات شاملة ومفصلة
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-3">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>أداء سريع</CardTitle>
              <CardDescription>
                تقنيات حديثة تضمن سرعة استجابة عالية وتجربة سلسة بدون تأخير
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Roles Section */}
      <section className="container py-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            أدوار المستخدمين
          </h2>
          <p className="text-muted-foreground text-lg">
            نظام صلاحيات متعدد المستويات
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <Card className="hover-lift animate-fade-in-up stagger-1">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">المدير</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>صلاحيات كاملة للنظام</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>إدارة المستخدمين</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>عرض جميع الإحصائيات</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>إدارة الطلبات والمهام</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <ClipboardList className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">خدمة العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>إنشاء طلبات الخدمة</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>تعيين العمال</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>تحديث حالة الطلبات</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>متابعة الطلبات</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-3">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">العامل</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>عرض المهام المخصصة</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>تحديث حالة المهام</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>إضافة ملاحظات</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>متابعة الإنجاز</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="container py-20">
          <Card className="hover-lift animate-scale-in bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                جاهز للبدء؟
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                ابدأ باستخدام Tempweb الآن واستمتع بتجربة إدارة خدمات احترافية وسلسة
              </p>
              <Link to="/login">
                <Button size="lg" className="hover-lift text-lg px-8 py-6">
                  <Zap className="w-5 h-5 ml-2" />
                  تسجيل الدخول الآن
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold gradient-text">Tempweb</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2025 Tempweb
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
