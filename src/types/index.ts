export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// أنواع المستخدمين
export type UserRole = 'admin' | 'customer_service' | 'worker';

// حالة المهمة
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// حالة طلب الخدمة
export type RequestStatus = 'new' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

// المستخدم
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

// الخدمة
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: number; // بالدقائق
  createdAt: string;
}

// طلب الخدمة
export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  description: string;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string; // معرف العامل
  assignedWorkerName?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// المهمة
export interface Task {
  id: string;
  requestId: string;
  workerId: string;
  workerName: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
}

// إحصائيات لوحة التحكم
export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  totalWorkers: number;
  activeWorkers: number;
}

// بيانات تسجيل الدخول
export interface LoginCredentials {
  username: string;
  password: string;
}

// بيانات المستخدم المسجل
export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phone?: string;
}
