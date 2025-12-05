import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setVerifying(false);
      return;
    }

    verifyPayment(sessionId);
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
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
        setVerifying(false);
        return;
      }

      const data = response.data?.data;
      setVerified(data?.verified || false);
      setPaymentDetails(data);
      setVerifying(false);

      if (data?.verified) {
        toast({
          title: 'Payment Successful',
          description: 'Your order has been confirmed!'
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerifying(false);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-secondary/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <CardTitle>Verifying Payment</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-secondary/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {verified ? (
              <CheckCircle2 className="w-16 h-16 text-accent" />
            ) : (
              <XCircle className="w-16 h-16 text-destructive" />
            )}
          </div>
          <CardTitle>
            {verified ? 'Payment Successful!' : 'Payment Verification Failed'}
          </CardTitle>
          <CardDescription>
            {verified
              ? 'Thank you for your purchase. Your order has been confirmed.'
              : 'We could not verify your payment. Please contact support if you were charged.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verified && paymentDetails && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  ${(paymentDetails.amount / 100).toFixed(2)} {paymentDetails.currency?.toUpperCase()}
                </span>
              </div>
              {paymentDetails.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{paymentDetails.customerEmail}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-accent">Paid</span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              View Orders
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
