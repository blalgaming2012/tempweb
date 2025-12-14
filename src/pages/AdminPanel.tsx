import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers, createUser, updateUser, deleteUser } from '@/services/storage';
import type { User, UserRole } from '@/types';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export default function AdminPanel() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'worker' as UserRole,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };

  const handleCreateUser = () => {
    if (!formData.username || !formData.password || !formData.fullName) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    // التحقق من عدم تكرار اسم المستخدم
    const existingUser = users.find(u => u.username === formData.username);
    if (existingUser) {
      toast({
        title: 'خطأ',
        description: 'اسم المستخدم موجود بالفعل',
        variant: 'destructive',
      });
      return;
    }

    createUser({
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    });

    toast({
      title: 'تم إنشاء المستخدم',
      description: 'تم إنشاء المستخدم بنجاح',
    });

    setIsCreateDialogOpen(false);
    resetForm();
    loadUsers();
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    if (!formData.username || !formData.fullName) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    updateUser(selectedUser.id, {
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      ...(formData.password && { password: formData.password }),
    });

    toast({
      title: 'تم التحديث',
      description: 'تم تحديث بيانات المستخدم بنجاح',
    });

    setIsEditDialogOpen(false);
    setSelectedUser(null);
    resetForm();
    loadUsers();
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      deleteUser(userId);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المستخدم بنجاح',
      });
      loadUsers();
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      fullName: user.fullName,
      email: user.email || '',
      phone: user.phone || '',
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'worker',
    });
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: { label: 'مدير', variant: 'destructive' as const },
      customer_service: { label: 'خدمة عملاء', variant: 'default' as const },
      worker: { label: 'عامل', variant: 'secondary' as const },
    };
    const config = roleConfig[role];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role === filterRole);

  return (
    <div className="container py-8">
      <div className="parallax-bg" />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">إدارة جميع مستخدمي النظام</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إنشاء مستخدم جديد</DialogTitle>
              <DialogDescription>أدخل بيانات المستخدم الجديد</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="أدخل اسم المستخدم"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="أدخل كلمة المرور"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="أدخل الاسم الكامل"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05xxxxxxxx"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">الدور *</Label>
                <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">مدير</SelectItem>
                    <SelectItem value="customer_service">خدمة عملاء</SelectItem>
                    <SelectItem value="worker">عامل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateUser}>
                  إنشاء المستخدم
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="تصفية حسب الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المستخدمين</SelectItem>
            <SelectItem value="admin">مدير</SelectItem>
            <SelectItem value="customer_service">خدمة عملاء</SelectItem>
            <SelectItem value="worker">عامل</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{user.fullName}</CardTitle>
                  <CardDescription>
                    @{user.username}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getRoleBadge(user.role)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {user.email && (
                    <div>
                      <span className="text-muted-foreground">البريد الإلكتروني:</span>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  )}
                  {user.phone && (
                    <div>
                      <span className="text-muted-foreground">رقم الهاتف:</span>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(user)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  تاريخ الإنشاء: {new Date(user.createdAt).toLocaleString('ar-SA')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">لا يوجد مستخدمون</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>تحديث بيانات المستخدم</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">اسم المستخدم *</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="أدخل اسم المستخدم"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">كلمة المرور الجديدة (اتركها فارغة للإبقاء على القديمة)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="أدخل كلمة المرور الجديدة"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fullName">الاسم الكامل *</Label>
              <Input
                id="edit-fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="أدخل الاسم الكامل"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">البريد الإلكتروني</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">رقم الهاتف</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="05xxxxxxxx"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">الدور *</Label>
              <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="customer_service">خدمة عملاء</SelectItem>
                  <SelectItem value="worker">عامل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdateUser}>
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
