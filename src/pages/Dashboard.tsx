// src/pages/Dashboard.tsx - الكود المصحح

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi, requestsApi } from '@/db/api';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Order, Request } from '@/types/types';
import { Package, MessageSquare, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useWindowSize } from '@/hooks/useWindowSize'; 

export default function Dashboard() {
  const { t } = useTranslation(); 
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { width } = useWindowSize(); 
  const isMobile = width !== undefined && width < 768; 

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [ordersData, requestsData] = await Promise.all([
      ordersApi.getUserOrders(),
      requestsApi.getUserRequests()
    ]);
    setOrders(ordersData);
    setRequests(requestsData);
    setLoading(false);
  };

  const handleRefreshOrder = async (orderId: string, sessionId: string | null) => {
    if (!sessionId) {
      toast({
        title: t('error'),
        description: t('no_session_id_error'),
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('verify_stripe_payment', {
        body: { sessionId }
      });

      if (response.error) {
        const errorMsg = await response.error?.context?.text();
        console.error('Edge function error in verify_stripe_payment:', errorMsg);
        toast({
          title: t('verification_error'),
          description: errorMsg || t('failed_to_verify_payment'),
          variant: 'destructive'
        });
        return;
      }

      const data = response.data?.data;
      if (data?.verified) {
        toast({
          title: t('payment_verified'),
          description: t('order_status_updated')
        });
        loadData();
      } else {
        toast({
          title: t('payment_not_completed'),
          description: t('order_not_paid_yet'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: t('error'),
        description: t('failed_to_refresh_status'),
        variant: 'destructive'
      });
    }
  };

  const handleRetryPayment = async (order: Order) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: t('session_expired'),
          description: t('please_login_again'),
          variant: 'destructive'
        });
        navigate('/login');
        return;
      }

      const response = await supabase.functions.invoke('create_stripe_checkout', {
        body: {
          items: order.items,
          currency: order.currency,
          payment_method_types: ['card']
        }
      });

      if (response.error) {
        const errorMsg = await response.error?.context?.text();
        console.error('Edge function error in create_stripe_checkout:', errorMsg);
        toast({
          title: t('payment_error'),
          description: errorMsg || t('failed_to_create_checkout'),
          variant: 'destructive'
        });
        return;
      }

      if (response.data?.data?.url) {
        window.open(response.data.data.url, '_blank');
      }
    } catch (error) {
      console.error('Retry payment error:', error);
      toast({
        title: t('error'),
        description: t('unexpected_error_occurred'),
        variant: 'destructive'
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(t('cancellation_confirm'))) { 
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' }) 
        .eq('id', orderId);

      if (error) {
        console.error('Error cancelling order:', error);
        toast({
          title: t('cancellation_failed'),
          description: error.message || t('could_not_cancel_order'),
          variant: 'destructive'
        });
      } else {
        toast({
          title: t('order_cancelled'),
          description: t('order_successfully_cancelled')
        });
        loadData(); 
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast({
        title: t('error'),
        description: t('unexpected_error_cancellation'),
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      completed: 'default',
      cancelled: 'destructive',
      refunded: 'outline',
      processing: 'secondary' // 💡 تأكد من وجود هذه الحالة
    };
    const translatedStatus = t(status.toLowerCase()); 

    return (
      <Badge variant={variants[status] || 'default'}>
        {translatedStatus}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">{t('loading')}...</div>
      </div>
    );
  }

// ... (ما قبل دالة return) ...

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className={isMobile ? "text-2xl font-bold text-foreground mb-2" : "text-3xl font-bold text-foreground mb-2"}>
          {t('dashboard_title')}
        </h1>
        
        <p className="text-muted-foreground">
          {t('welcome_message', { username: profile?.username || 'User' })}
        </p>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        {/* ✅ TabsList: تم تصحيح طريقة دمج الـ Classes المشروطة */}
        <TabsList className={`
          ${isMobile ? "grid w-full grid-cols-2" : ""}`
        }>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            {t('orders_tab')}
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('requests_tab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('no_orders')}</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{t('order')} #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{t('items')}</h4>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {item.name} - ${item.price} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* ✅ Div الرئيسية: تم تصحيح طريقة دمج الـ Classes المشروطة */}
                  <div className={`flex justify-between items-center pt-4 border-t ${isMobile ? "flex-col items-start gap-4" : ""}`}> 
                    <span className="font-semibold">
                      {t('total')}: ${order.total_amount} {order.currency.toUpperCase()}
                    </span>
                    {/* ✅ Div الأزرار: تم تصحيح طريقة دمج الـ Classes المشروطة */}
                    <div className={`flex gap-2 ${isMobile ? "w-full flex-col" : ""}`}>
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefreshOrder(order.id, order.stripe_session_id)}
                            className={isMobile ? "w-full" : ""}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {t('refresh_status')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRetryPayment(order)}
                            className={isMobile ? "w-full" : ""}
                          >
                            {t('retry_payment')}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelOrder(order.id)}
                            className={isMobile ? "w-full" : ""}
                          >
                            {t('cancel_order')}
                          </Button>
                        </>
                      )}
                      {order.status === 'completed' && order.completed_at && (
                        <span className="text-sm text-muted-foreground">
                          {t('completed')}: {new Date(order.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('no_requests')}</p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.name}</CardTitle>
                      <CardDescription>
                        {new Date(request.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">{t('email')}:</span>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">{t('project_description')}</span>
                    <p className="text-sm text-muted-foreground">{request.project_description}</p>
                  </div>
                  {request.budget_range && (
                    <div>
                      <span className="text-sm font-medium">{t('budget_range')}</span>
                      <p className="text-sm text-muted-foreground">{request.budget_range}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
// ... (تأكد من إغلاق المكون هنا بالقوسين المعقوفين)
}