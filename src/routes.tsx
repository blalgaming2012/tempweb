import type { ReactNode } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ServiceRequests from './pages/ServiceRequests';
import WorkerTasks from './pages/WorkerTasks';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'الصفحة الرئيسية',
    path: '/',
    element: <Home />,
  },
  {
    name: 'تسجيل الدخول',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'لوحة التحكم',
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    name: 'طلبات الخدمة',
    path: '/requests',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'customer_service']}>
        <ServiceRequests />
      </ProtectedRoute>
    ),
  },
  {
    name: 'مهامي',
    path: '/my-tasks',
    element: (
      <ProtectedRoute allowedRoles={['worker']}>
        <WorkerTasks />
      </ProtectedRoute>
    ),
  },
  {
    name: 'إدارة المستخدمين',
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminPanel />
      </ProtectedRoute>
    ),
  },
];

export default routes;
