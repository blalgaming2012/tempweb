import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllRequests, getAllTasks, getAllUsers, getTasksByWorkerId } from '@/services/storage';
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Users, Briefcase, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const getStats = () => {
    if (!user) return null;

    const requests = getAllRequests();
    const tasks = getAllTasks();
    const users = getAllUsers();

    if (user.role === 'worker') {
      const myTasks = getTasksByWorkerId(user.id);
      return {
        totalTasks: myTasks.length,
        pendingTasks: myTasks.filter(t => t.status === 'pending').length,
        inProgressTasks: myTasks.filter(t => t.status === 'in_progress').length,
        completedTasks: myTasks.filter(t => t.status === 'completed').length,
      };
    }

    return {
      totalRequests: requests.length,
      newRequests: requests.filter(r => r.status === 'new').length,
      inProgressRequests: requests.filter(r => r.status === 'in_progress').length,
      completedRequests: requests.filter(r => r.status === 'completed').length,
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      totalWorkers: users.filter(u => u.role === 'worker').length,
    };
  };

  const stats = getStats();

  if (!stats) return null;

  if (user?.role === 'worker') {
    return (
      <div className="container py-8">
        <div className="parallax-bg" />
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary animate-bounce-subtle" />
            مرحباً، {user.fullName}
          </h1>
          <p className="text-muted-foreground">إليك ملخص مهامك</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift animate-fade-in-up stagger-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المهام</CardTitle>
              <Briefcase className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">جميع المهام المخصصة لك</p>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">مهام معلقة</CardTitle>
              <AlertCircle className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">في انتظار البدء</p>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
              <Clock className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">جاري العمل عليها</p>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">تم إنجازها</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="parallax-bg" />
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary animate-bounce-subtle" />
          مرحباً، {user?.fullName}
        </h1>
        <p className="text-muted-foreground">إليك ملخص النظام</p>
      </div>

      <div className="space-y-6">
        <div className="animate-fade-in-up stagger-1">
          <h2 className="text-xl font-heading font-semibold mb-4">طلبات الخدمة</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">جميع الطلبات</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">طلبات جديدة</CardTitle>
                <AlertCircle className="w-4 h-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">لم يتم معالجتها</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
                <Clock className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgressRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">جاري العمل عليها</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">تم إنجازها</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="animate-fade-in-up stagger-2">
          <h2 className="text-xl font-heading font-semibold mb-4">المهام</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المهام</CardTitle>
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">جميع المهام</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">معلقة</CardTitle>
                <AlertCircle className="w-4 h-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">في انتظار البدء</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">قيد التنفيذ</CardTitle>
                <Clock className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">جاري العمل عليها</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">تم إنجازها</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="animate-fade-in-up stagger-3">
            <h2 className="text-xl font-heading font-semibold mb-4">المستخدمون</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">العمال</CardTitle>
                  <Users className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalWorkers}</div>
                  <p className="text-xs text-muted-foreground mt-1">إجمالي العمال</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

