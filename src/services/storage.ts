import type { User, ServiceRequest, Task, Service, AuthUser } from '@/types';

// مفاتيح التخزين المحلي
const STORAGE_KEYS = {
  USERS: 'service_management_users',
  SERVICES: 'service_management_services',
  REQUESTS: 'service_management_requests',
  TASKS: 'service_management_tasks',
  CURRENT_USER: 'service_management_current_user',
  THEME: 'service_management_theme',
};

// دالة مساعدة للحصول على البيانات من localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// دالة مساعدة لحفظ البيانات في localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// توليد معرف فريد
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============= إدارة المستخدمين =============

export function initializeUsers(): void {
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    // إنشاء مستخدم مدير افتراضي
    const adminUser: User = {
      id: generateId(),
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      fullName: 'المدير العام',
      email: 'admin@example.com',
      createdAt: new Date().toISOString(),
    };
    
    // إنشاء مستخدم خدمة عملاء
    const csUser: User = {
      id: generateId(),
      username: 'service1',
      password: 'service123',
      role: 'customer_service',
      fullName: 'موظف خدمة العملاء',
      email: 'service@example.com',
      createdAt: new Date().toISOString(),
    };
    
    // إنشاء عامل
    const workerUser: User = {
      id: generateId(),
      username: 'worker1',
      password: 'worker123',
      role: 'worker',
      fullName: 'العامل الأول',
      phone: '0501234567',
      createdAt: new Date().toISOString(),
    };
    
    saveToStorage(STORAGE_KEYS.USERS, [adminUser, csUser, workerUser]);
  }
}

export function getAllUsers(): User[] {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
}

export function getUserById(id: string): User | undefined {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  const users = getAllUsers();
  return users.find(u => u.username === username);
}

export function updateUser(id: string, updates: Partial<User>): boolean {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);
    return true;
  }
  return false;
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const users = getAllUsers();
  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);
  return newUser;
}

export function deleteUser(id: string): boolean {
  const users = getAllUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length !== users.length) {
    saveToStorage(STORAGE_KEYS.USERS, filtered);
    return true;
  }
  return false;
}

// ============= إدارة الخدمات =============

export function initializeServices(): void {
  const services = getFromStorage<Service[]>(STORAGE_KEYS.SERVICES, []);
  if (services.length === 0) {
    const defaultServices: Service[] = [
      {
        id: generateId(),
        name: 'صيانة عامة',
        description: 'خدمات الصيانة العامة للمنشآت',
        category: 'صيانة',
        estimatedDuration: 120,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'تنظيف',
        description: 'خدمات التنظيف الشاملة',
        category: 'تنظيف',
        estimatedDuration: 90,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'كهرباء',
        description: 'أعمال الكهرباء والإصلاحات',
        category: 'كهرباء',
        estimatedDuration: 60,
        createdAt: new Date().toISOString(),
      },
    ];
    saveToStorage(STORAGE_KEYS.SERVICES, defaultServices);
  }
}

export function getAllServices(): Service[] {
  return getFromStorage<Service[]>(STORAGE_KEYS.SERVICES, []);
}

export function getServiceById(id: string): Service | undefined {
  const services = getAllServices();
  return services.find(s => s.id === id);
}

// ============= إدارة طلبات الخدمة =============

export function initializeRequests(): void {
  const requests = getFromStorage<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, []);
  if (requests.length === 0) {
    saveToStorage(STORAGE_KEYS.REQUESTS, []);
  }
}

export function getAllRequests(): ServiceRequest[] {
  return getFromStorage<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, []);
}

export function getRequestById(id: string): ServiceRequest | undefined {
  const requests = getAllRequests();
  return requests.find(r => r.id === id);
}

export function createRequest(request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): ServiceRequest {
  const newRequest: ServiceRequest = {
    ...request,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const requests = getAllRequests();
  requests.push(newRequest);
  saveToStorage(STORAGE_KEYS.REQUESTS, requests);
  return newRequest;
}

export function updateRequest(id: string, updates: Partial<ServiceRequest>): boolean {
  const requests = getAllRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index] = { 
      ...requests[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.REQUESTS, requests);
    return true;
  }
  return false;
}

export function deleteRequest(id: string): boolean {
  const requests = getAllRequests();
  const filtered = requests.filter(r => r.id !== id);
  if (filtered.length !== requests.length) {
    saveToStorage(STORAGE_KEYS.REQUESTS, filtered);
    return true;
  }
  return false;
}

// ============= إدارة المهام =============

export function initializeTasks(): void {
  const tasks = getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
  if (tasks.length === 0) {
    saveToStorage(STORAGE_KEYS.TASKS, []);
  }
}

export function getAllTasks(): Task[] {
  return getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
}

export function getTaskById(id: string): Task | undefined {
  const tasks = getAllTasks();
  return tasks.find(t => t.id === id);
}

export function getTasksByWorkerId(workerId: string): Task[] {
  const tasks = getAllTasks();
  return tasks.filter(t => t.workerId === workerId);
}

export function getTasksByRequestId(requestId: string): Task[] {
  const tasks = getAllTasks();
  return tasks.filter(t => t.requestId === requestId);
}

export function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const tasks = getAllTasks();
  tasks.push(newTask);
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): boolean {
  const tasks = getAllTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { 
      ...tasks[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (updates.status === 'completed' && !tasks[index].completedAt) {
      tasks[index].completedAt = new Date().toISOString();
    }
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    return true;
  }
  return false;
}

export function deleteTask(id: string): boolean {
  const tasks = getAllTasks();
  const filtered = tasks.filter(t => t.id !== id);
  if (filtered.length !== tasks.length) {
    saveToStorage(STORAGE_KEYS.TASKS, filtered);
    return true;
  }
  return false;
}

// ============= إدارة المصادقة =============

export function login(username: string, password: string): AuthUser | null {
  const user = getUserByUsername(username);
  if (user && user.password === password) {
    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    };
    saveToStorage(STORAGE_KEYS.CURRENT_USER, authUser);
    return authUser;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser(): AuthUser | null {
  return getFromStorage<AuthUser | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// ============= إدارة الثيم =============

export function getTheme(): 'light' | 'dark' {
  return getFromStorage<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light');
}

export function setTheme(theme: 'light' | 'dark'): void {
  saveToStorage(STORAGE_KEYS.THEME, theme);
}

// ============= تهيئة البيانات =============

export function initializeStorage(): void {
  initializeUsers();
  initializeServices();
  initializeRequests();
  initializeTasks();
}
