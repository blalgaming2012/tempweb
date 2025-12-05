import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { requestsApi } from '@/db/api';
import { Check, Code2, Palette, Zap, Globe } from 'lucide-react';
import type { ServicePackage } from '@/types/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const servicePackages: ServicePackage[] = [
  {
    id: 'basic',
    name: 'Basic Package',
    description: 'Simple HTML/CSS/JS website',
    features: [
      '1-3 pages',
      'Responsive design',
      'Basic SEO optimization',
      'Contact form',
      '1 month support'
    ],
    price: 299
  },
  {
    id: 'standard',
    name: 'Standard Package',
    description: 'Responsive website with interactive features',
    features: [
      '5-8 pages',
      'Advanced responsive design',
      'Interactive elements',
      'SEO optimization',
      'Contact & inquiry forms',
      '3 months support'
    ],
    price: 699,
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'premium',
    name: 'Premium Package',
    description: 'Custom-designed website with advanced functionality',
    features: [
      '10+ pages',
      'Custom design',
      'Advanced animations',
      'Full SEO package',
      'CMS integration',
      'E-commerce ready',
      '6 months support'
    ],
    price: 1499
  },
  {
    id: 'maintenance',
    name: 'Maintenance Plan',
    description: 'Monthly website updates and support',
    features: [
      'Regular updates',
      'Bug fixes',
      'Content updates',
      'Performance monitoring',
      'Security patches',
      'Priority support'
    ],
    price: 99,
    badge: 'Monthly'
  }
];

const templateImages = [
  {
    id: 1,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/2465f527-c564-4906-978d-fe77f5319d4a.jpg',
    title: 'Modern Business Website',
    description: 'Professional corporate website with clean design'
  },
  {
    id: 2,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/aef35205-1dc1-44ab-bb28-873465897597.jpg',
    title: 'Portfolio Website',
    description: 'Creative portfolio showcase for developers'
  },
  {
    id: 3,
    url: 'https://miaoda-site-img.s3cdn.medo.dev/images/aeff408b-1596-4a1c-8422-c86561712d4e.jpg',
    title: 'E-commerce Platform',
    description: 'Full-featured online store solution'
  }
];

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    project_description: '',
    budget_range: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleBuyNow = async (pkg: ServicePackage) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to purchase packages',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

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
          items: [{
            name: pkg.name,
            price: pkg.price,
            quantity: 1
          }],
          currency: 'usd',
          payment_method_types: ['card']
        }
      });

      if (response.error) {
        const errorMsg = await response.error?.context?.text();
        console.error('Edge function error in create_stripe_checkout:', errorMsg);
        toast({
          title: 'Payment Error',
          description: errorMsg || 'Failed to create checkout session. Please ensure STRIPE_SECRET_KEY is configured.',
          variant: 'destructive'
        });
        return;
      }

      if (response.data?.data?.url) {
        window.open(response.data.data.url, '_blank');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create checkout session',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestForm.name || !requestForm.email || !requestForm.project_description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    const success = await requestsApi.createRequest(requestForm);
    setSubmitting(false);

    if (success) {
      toast({
        title: 'Request Submitted',
        description: 'We will contact you soon!'
      });
      setRequestForm({
        name: '',
        email: '',
        project_description: '',
        budget_range: ''
      });
    } else {
      toast({
        title: 'Submission Failed',
        description: 'Please try again later',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 xl:px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl xl:text-6xl font-bold text-foreground mb-6">
            Professional Web Development Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your ideas into stunning websites with our expert HTML/CSS/JS development services
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => document.getElementById('store')?.scrollIntoView({ behavior: 'smooth' })}>
              View Packages
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' })}>
              Request Quote
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 xl:px-6 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Code2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Clean Code</h3>
              <p className="text-muted-foreground">Well-structured, maintainable code</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Modern Design</h3>
              <p className="text-muted-foreground">Beautiful, responsive interfaces</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Performance</h3>
              <p className="text-muted-foreground">Optimized for speed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">SEO Ready</h3>
              <p className="text-muted-foreground">Built for search engines</p>
            </div>
          </div>
        </div>
      </section>

      <section id="store" className="py-20 px-4 xl:px-6 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">Store Zone</h2>
            <p className="text-lg text-muted-foreground">Choose the perfect package for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {servicePackages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">{pkg.badge}</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">${pkg.price}</span>
                    {pkg.id === 'maintenance' && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleBuyNow(pkg)}>
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="py-20 px-4 xl:px-6 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">Template Zone</h2>
            <p className="text-lg text-muted-foreground">Explore our portfolio of stunning websites</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {templateImages.map((template) => (
              <Card key={template.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={template.url}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="py-20 px-4 xl:px-6 bg-secondary/20">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">Request Zone</h2>
            <p className="text-lg text-muted-foreground">Tell us about your project and we'll get back to you</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Project Request Form</CardTitle>
              <CardDescription>Fill in the details below and we'll contact you soon</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project Description *</Label>
                  <Textarea
                    id="project"
                    value={requestForm.project_description}
                    onChange={(e) => setRequestForm({ ...requestForm, project_description: e.target.value })}
                    placeholder="Describe your project requirements..."
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select
                    value={requestForm.budget_range}
                    onValueChange={(value) => setRequestForm({ ...requestForm, budget_range: value })}
                  >
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-500">Under $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                      <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                      <SelectItem value="over-5000">Over $5,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
