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

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        title: 'Error',
        description: 'No session ID found for this order',
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
          title: 'Verification Error',
          description: errorMsg || 'Failed to verify payment',
          variant: 'destructive'
        });
        return;
      }

      const data = response.data?.data;
      if (data?.verified) {
        toast({
          title: 'Payment Verified',
          description: 'Order status updated successfully'
        });
        loadData();
      } else {
        toast({
          title: 'Payment Not Completed',
          description: 'This order has not been paid yet',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh order status',
        variant: 'destructive'
      });
    }
  };

  const handleRetryPayment = async (order: Order) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Session Expired',
          description: 'Please login again',
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
          title: 'Payment Error',
          description: errorMsg || 'Failed to create checkout session',
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
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      completed: 'default',
      cancelled: 'destructive',
      refunded: 'outline'
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.username || 'User'}!
        </p>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Items:</h4>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {item.name} - ${item.price} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-semibold">
                      Total: ${order.total_amount} {order.currency.toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefreshOrder(order.id, order.stripe_session_id)}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Status
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRetryPayment(order)}
                          >
                            Retry Payment
                          </Button>
                        </>
                      )}
                      {order.status === 'completed' && order.completed_at && (
                        <span className="text-sm text-muted-foreground">
                          Completed: {new Date(order.completed_at).toLocaleDateString()}
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
                <p className="text-muted-foreground">No requests yet</p>
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
                    <Badge>{request.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Project Description:</span>
                    <p className="text-sm text-muted-foreground">{request.project_description}</p>
                  </div>
                  {request.budget_range && (
                    <div>
                      <span className="text-sm font-medium">Budget Range:</span>
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
}
