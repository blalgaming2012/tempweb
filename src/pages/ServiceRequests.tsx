import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAllRequests, createRequest, updateRequest, deleteRequest, getAllServices, getAllUsers } from '@/services/storage';
import type { ServiceRequest, RequestStatus } from '@/types';
import { Plus, Edit, Trash2, Eye, UserPlus } from 'lucide-react';

export default function ServiceRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceId: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRequests = getAllRequests();
    setRequests(allRequests);
    setServices(getAllServices());
    const allUsers = getAllUsers();
    setWorkers(allUsers.filter(u => u.role === 'worker'));
  };

  const handleCreateRequest = () => {
    if (!formData.customerName || !formData.customerPhone || !formData.serviceId || !formData.description) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    const service = services.find(s => s.id === formData.serviceId);
    if (!service) return;

    createRequest({
      customerId: 'customer-' + Date.now(),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      serviceId: formData.serviceId,
      serviceName: service.name,
      description: formData.description,
      status: 'new',
      priority: formData.priority,
    });

    toast({
      title: 'تم إنشاء الطلب',
      description: 'تم إنشاء طلب الخدمة بنجاح',
    });

    setIsCreateDialogOpen(false);
    resetForm();
    loadData();
  };

  const handleUpdateStatus = (requestId: string, status: RequestStatus) => {
    updateRequest(requestId, { status });
    toast({
      title: 'تم تحديث الحالة',
      description: 'تم تحديث حالة الطلب بنجاح',
    });
    loadData();
  };

  const handleAssignWorker = (requestId: string, workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    updateRequest(requestId, {
      assignedTo: workerId,
      assignedWorkerName: worker.fullName,
      status: 'assigned',
    });

    toast({
      title: 'تم تعيين العامل',
      description: `تم تعيين ${worker.fullName} للطلب`,
    });
    loadData();
  };

  const handleDeleteRequest = (requestId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      deleteRequest(requestId);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الطلب بنجاح',
      });
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      serviceId: '',
      description: '',
      priority: 'medium',
    });
  };

  const getStatusBadge = (status: RequestStatus) => {
    const statusConfig = {
      new: { label: 'جديد', variant: 'default' as const },
      assigned: { label: 'معين', variant: 'secondary' as const },
      in_progress: { label: 'قيد التنفيذ', variant: 'default' as const },
      completed: { label: 'مكتمل', variant: 'default' as const },
      cancelled: { label: 'ملغي', variant: 'destructive' as const },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    const priorityConfig = {
      low: { label: 'منخفضة', variant: 'secondary' as const },
      medium: { label: 'متوسطة', variant: 'default' as const },
      high: { label: 'عالية', variant: 'destructive' as const },
    };
    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  return (
    <div className="container py-8">
      <div className="parallax-bg" />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">طلبات الخدمة</h1>
          <p className="text-muted-foreground">إدارة جميع طلبات الخدمة</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              طلب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إنشاء طلب خدمة جديد</DialogTitle>
              <DialogDescription>أدخل تفاصيل طلب الخدمة</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">اسم العميل *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="أدخل اسم العميل"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="05xxxxxxxx"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="example@email.com"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceId">نوع الخدمة *</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف الطلب *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل تفاصيل الطلب"
                  rows={4}
                  dir="rtl"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateRequest}>
                  إنشاء الطلب
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الطلبات</SelectItem>
            <SelectItem value="new">جديد</SelectItem>
            <SelectItem value="assigned">معين</SelectItem>
            <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{request.serviceName}</CardTitle>
                  <CardDescription>
                    العميل: {request.customerName} | {request.customerPhone}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(request.status)}
                  {getPriorityBadge(request.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">{request.description}</p>
                
                {request.assignedWorkerName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserPlus className="w-4 h-4" />
                    <span>العامل المعين: {request.assignedWorkerName}</span>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Select onValueChange={(value) => handleUpdateStatus(request.id, value as RequestStatus)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="تغيير الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">جديد</SelectItem>
                      <SelectItem value="assigned">معين</SelectItem>
                      <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handleAssignWorker(request.id, value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="تعيين عامل" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id}>
                          {worker.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRequest(request.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  تاريخ الإنشاء: {new Date(request.createdAt).toLocaleString('ar-SA')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">لا توجد طلبات</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
