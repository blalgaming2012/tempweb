import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Zap, Sparkles } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // إذا كان المستخدم مسجل دخول بالفعل، إعادة توجيهه إلى لوحة التحكم
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم المستخدم وكلمة المرور',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const result = await login({ username, password });
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في Tempweb',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'فشل تسجيل الدخول',
        description: result.error || 'حدث خطأ أثناء تسجيل الدخول',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="parallax-bg" />
      <Card className="w-full max-w-md animate-scale-in hover-lift">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
            <Zap className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-heading gradient-text flex items-center justify-center gap-2">
            Tempweb
            <Sparkles className="w-6 h-6 text-primary animate-bounce-subtle" />
          </CardTitle>
          <CardDescription className="text-base mt-2">نظام إدارة الخدمات والعمال التفاعلي</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 animate-fade-in-up stagger-1">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                dir="rtl"
                className="hover-glow"
              />
            </div>
            <div className="space-y-2 animate-fade-in-up stagger-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                dir="rtl"
                className="hover-glow"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full animate-fade-in-up stagger-3 hover-lift" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm space-y-2 animate-fade-in-up stagger-4 hover-glow">
            <p className="font-semibold text-center mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              حسابات تجريبية
              <Sparkles className="w-4 h-4 text-primary" />
            </p>
            <div className="space-y-1">
              <p><strong>مدير:</strong> admin / admin123</p>
              <p><strong>خدمة عملاء:</strong> service1 / service123</p>
              <p><strong>عامل:</strong> worker1 / worker123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
