import { supabase } from './supabase';
import type { Profile, Order, Request } from '@/types/types';

export const profilesApi = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    return true;
  }
};

export const ordersApi = {
  async getUserOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }
    return data;
  }
};

export const requestsApi = {
  async createRequest(request: {
    name: string;
    email: string;
    project_description: string;
    budget_range?: string;
  }): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('requests')
      .insert({
        user_id: user?.id || null,
        name: request.name,
        email: request.email,
        project_description: request.project_description,
        budget_range: request.budget_range || null
      });

    if (error) {
      console.error('Error creating request:', error);
      return false;
    }
    return true;
  },

  async getUserRequests(): Promise<Request[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  }
};
