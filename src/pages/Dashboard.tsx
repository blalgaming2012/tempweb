import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Package, MessageSquare, Briefcase, RefreshCw, User, FileText, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // لـ النقطة 12

// *** أنواع البيانات الأساسية (يجب ربطها بـ Supabase) ***
interface Order {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
    created_at: string;
    total_amount: number;
    currency: string;
    worker_id?: string;
}

interface Request {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'closed';
    created_at: string;
}

// *** الدوال والأدوات المساعدة ***
const getStatusBadge = (status: string) => {
    const { t } = useTranslation();
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    switch (status) {
        case 'completed': variant = 'default'; break;
        case 'pending': variant = 'outline'; break;
        case 'processing': variant = 'secondary'; break;
        case 'failed':
        case 'cancelled': variant = 'destructive'; break;
    }
    return <Badge variant={variant} className="capitalize">{t(`status_${status}`)}</Badge>;
};

const handleOpenSupport = () => {
    // 💡 Routing: التوجيه إلى صفحة خدمة العملاء (Service Panel)
    console.log("Navigating to Customer Support/Service Panel.");
    // مثال: navigate('/support');
};

const handleOpenChat = (orderId: string, workerId?: string) => { 
    // 💡 Routing: التوجيه إلى صفحة الدردشة الخاصة بالطلب
    console.log(`Opening chat for order ${orderId} with worker ${workerId}`);
    // مثال: navigate(`/chat/${orderId}`);
};

const handleCancelOrder = (orderId: string) => { // النقطة 1: زر الإلغاء
    if (window.confirm(`Are you sure you want to cancel order ${orderId}?`)) {
        console.log(`Cancelling order ${orderId}`);
        // 💡 Backend: استدعاء API لتحديث حالة الطلب إلى 'cancelled'.
    }
};

// ** المكون الرئيسي **
export default function Dashboard() {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    
    // ** بيانات تجريبية: يجب استبدالها ببيانات حقيقية من Supabase
    const profile = { username: 'Ahmad', role: 'admin' }; // 'admin', 'coder', 'designer', 'service', 'user'
    const orders: Order[] = [
        { id: '1234567890', status: 'pending', created_at: new Date().toISOString(), total_amount: 1500, currency: 'EGP', worker_id: 'W1' },
    ];
    const requests: Request[] = [
        { id: 'req001', name: 'تصميم UI', status: 'pending', created_at: new Date().toISOString() },
    ];

    const isWorker = profile.role === 'coder' || profile.role === 'designer' || profile.role === 'service';
    const isAdmin = profile.role === 'admin';
    const isSupportUser = isAdmin || profile.role === 'service'; // النقطة 11

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    {/* تطبيق الاستجابة على الخط (النقطة 8) */}
                    <h1 className={isMobile ? "text-2xl font-bold text-foreground mb-2" : "text-3xl font-bold text-foreground mb-2"}>
                        {t('dashboard_title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('welcome_message', { username: profile?.username || t('user') })}
                    </p>
                </div>
                
                {/* النقطة 4: زر خدمة العملاء (خارج التاب) */}
                <Button variant="outline" onClick={handleOpenSupport}>
                    {t('customer_support')}
                </Button>
            </div>

            <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className={`
                    ${isMobile ? "grid w-full grid-cols-2" : "flex"} 
                    ${isSupportUser ? "lg:grid-cols-4" : "lg:grid-cols-3"}
                    lg:w-auto w-full`
                }>
                    <TabsTrigger value="orders" className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {t('orders_tab')}
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {t('requests_tab')}
                    </TabsTrigger>
                    
                    {/* النقطة 6: تبويب لوحة العمال (للمسؤول فقط) */}
                    {isAdmin && (
                         <TabsTrigger value="workers_control" className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {t('workers_control_tab')}
                        </TabsTrigger>
                    )}
                    
                    {/* النقطة 11: تبويب خدمة العملاء (للأدمن وموظف الخدمة) */}
                    {isSupportUser && (
                         <TabsTrigger value="service_panel" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {t('service_panel_tab')}
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* *** محتوى الطلبات *** */}
                <TabsContent value="orders" className="space-y-4">
                    {/* ... عرض الطلبات ... */}
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {t('order_id', { id: order.id })}
                                </CardTitle>
                                {getStatusBadge(order.status)}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <span className="font-semibold text-2xl">
                                    {order.total_amount} {order.currency.toUpperCase()}
                                </span>
                                
                                <div className={`flex justify-end items-center pt-4 border-t ${isMobile ? "flex-col items-start gap-4" : "gap-2"}`}> 
                                    
                                    {/* النقطة 1: زر التراجع عن الطلب */}
                                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                                        <Button size="sm" variant="destructive" onClick={() => handleCancelOrder(order.id)} className={isMobile ? "w-full" : ""}>
                                            <X className="w-4 h-4 mr-2" />
                                            {t('cancel_order')}
                                        </Button>
                                    )}

                                    {/* النقطة 2: زر فتح الدردشة */}
                                    <Button size="sm" variant="outline" onClick={() => handleOpenChat(order.id, order.worker_id)} className={isMobile ? "w-full" : ""}>
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        {t('open_chat')}
                                    </Button>

                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* *** محتوى الطلبات (Requests) *** */}
                <TabsContent value="requests" className="space-y-4">
                    {requests.map((request) => (
                         <Card key={request.id}>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('request_for', { name: request.name })}</CardTitle>
                                {getStatusBadge(request.status)}
                            </CardHeader>
                            <CardContent>
                                {/* ⬅️ النقطة 12: تحذير قانوني عند إلغاء الـ Request (يظهر قبل الإلغاء) */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="mt-4">
                                            {t('cancel_request')}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t('legal_warning_title')}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {/* 💡 هذا هو نص التحذير الذي طلبته (النقطة 12) */}
                                                {t('legal_warning_desc')}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{t('continue_request')}</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleCancelOrder(request.id)} className="bg-destructive hover:bg-red-700">
                                                {t('confirm_cancellation')}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                         </Card>
                    ))}
                </TabsContent>
                
                {/* *** محتوى لوحة خدمة العملاء (Service Panel) *** */}
                {isSupportUser && (
                    <TabsContent value="service_panel">
                        <Card>
                             <CardHeader><CardTitle>{t('service_panel_title')}</CardTitle></CardHeader>
                             <CardContent>
                                 <p>{t('service_panel_desc')}</p>
                                 {/* 💡 Backend: هنا يتم جلب وعرض رسائل خدمة العملاء من قاعدة البيانات */}
                             </CardContent>
                        </Card>
                    </TabsContent>
                )}

                 {/* *** محتوى لوحة تحكم العمال (Workers Control Panel) *** */}
                {isAdmin && (
                    <TabsContent value="workers_control">
                        <Card>
                             <CardHeader><CardTitle>{t('workers_control_title')}</CardTitle></CardHeader>
                             <CardContent>
                                 <p>{t('workers_control_desc')}</p>
                                 {/* 💡 Backend: هنا يتم واجهة لتعيين الأدوار وربطها بالنقاط 6 و 10 */}
                             </CardContent>
                        </Card>
                    </TabsContent>
                )}

            </Tabs>
        </div>
    );
}