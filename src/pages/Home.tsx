import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, ClipboardList, Shield, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div className="parallax-bg" />
      
      {/* Hero Section */}
      <section className="container py-20 animate-fade-in-down">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-6">
            <img 
              src="/tempweb-logo.png" 
              alt="Tempweb Logo" 
              className="w-96 h-auto border-0"
            />
          </div>
          
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
            {t('app.description')}
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.features.customerService.description')}
          </p>
          
          <div className="flex gap-4 justify-center pt-6 flex-wrap">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="hover-lift text-lg px-8 py-6">
                  <ArrowLeft className="w-5 h-5 ml-2" />
                  {t('nav.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" className="hover-lift text-lg px-8 py-6">
                    <Zap className="w-5 h-5 ml-2" />
                    {t('auth.login')}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="hover-lift text-lg px-8 py-6">
                  <Sparkles className="w-5 h-5 ml-2" />
                  {t('home.getStarted')}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('home.allYouNeed')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover-lift animate-fade-in-up stagger-1">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('home.features.serviceManagement.title')}</CardTitle>
              <CardDescription>
                {t('home.features.serviceManagement.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('home.features.workerManagement.title')}</CardTitle>
              <CardDescription>
                {t('home.features.workerManagement.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-3">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('home.features.security.title')}</CardTitle>
              <CardDescription>
                {t('home.features.security.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-1">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('home.features.interactive.title')}</CardTitle>
              <CardDescription>
                {t('home.features.interactive.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('home.features.realtime.title')}</CardTitle>
              <CardDescription>
                {t('home.features.realtime.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-3">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('home.features.performance.title')}</CardTitle>
              <CardDescription>
                {t('home.features.performance.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Roles Section */}
      <section className="container py-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {t('home.roles.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('home.roles.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <Card className="hover-lift animate-fade-in-up stagger-1">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">{t('home.roles.admin.title')}</CardTitle>
              <CardDescription className="mt-2">{t('home.roles.admin.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.admin.features.1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.admin.features.2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.admin.features.3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.admin.features.4')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <ClipboardList className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">{t('home.roles.customerService.title')}</CardTitle>
              <CardDescription className="mt-2">{t('home.roles.customerService.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.customerService.features.1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.customerService.features.2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.customerService.features.3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.customerService.features.4')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in-up stagger-3">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">{t('home.roles.worker.title')}</CardTitle>
              <CardDescription className="mt-2">{t('home.roles.worker.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.worker.features.1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.worker.features.2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.worker.features.3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{t('home.roles.worker.features.4')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="container py-20">
          <Card className="hover-lift animate-scale-in bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                جاهز للبدء؟
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                ابدأ باستخدام Tempweb الآن واستمتع بتجربة إدارة خدمات احترافية وسلسة
              </p>
              <Link to="/login">
                <Button size="lg" className="hover-lift text-lg px-8 py-6">
                  <Zap className="w-5 h-5 ml-2" />
                  تسجيل الدخول الآن
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/tempweb-logo.png" 
                alt="Tempweb Logo" 
                className="h-8 w-auto border-0"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              2025 Tempweb
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
