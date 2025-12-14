import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
          <div className="mx-auto mb-6 animate-fade-in-down">
            <img 
              src="/tempweb-logo.png" 
              alt="Tempweb Logo" 
              className="w-64 h-auto mx-auto animate-pulse-glow border-0"
            />
          </div>
          <CardTitle className="text-2xl font-heading gradient-text">
            تسجيل الدخول
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
        </CardContent>
      </Card>
    </div>
  );
}
