/*
# TempWeb Initial Database Schema

## Overview
This migration creates the core database structure for TempWeb, a web development service platform.

## 1. New Tables

### profiles
User profile information linked to auth.users
- `id` (uuid, primary key, references auth.users)
- `username` (text, unique, not null)
- `email` (text)
- `role` (user_role enum: 'user', 'admin')
- `created_at` (timestamptz)

### orders
Payment and order tracking
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `items` (jsonb, order items with package details)
- `total_amount` (numeric, total price in cents)
- `currency` (text, default 'usd')
- `status` (order_status enum: 'pending', 'completed', 'cancelled', 'refunded')
- `stripe_session_id` (text, unique)
- `stripe_payment_intent_id` (text)
- `customer_email` (text)
- `customer_name` (text)
- `completed_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### requests
Client project requests and inquiries
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles, nullable for guest requests)
- `name` (text, not null)
- `email` (text, not null)
- `project_description` (text, not null)
- `budget_range` (text)
- `status` (text, default 'pending')
- `created_at` (timestamptz)

## 2. Security

### RLS Policies
- **profiles**: Users can view/update own profile; admins have full access
- **orders**: Users can view own orders; service role manages all orders
- **requests**: Users can view own requests; admins can view all

### Helper Functions
- `is_admin(uid uuid)`: Check if user has admin role
- `handle_new_user()`: Auto-create profile when user confirms email

### Trigger
- Auto-sync confirmed users to profiles table (first user becomes admin)

## 3. Notes
- First registered user automatically becomes admin
- Orders managed through Edge Functions for security
- Guest users can submit requests without authentication
- Username authentication simulated with @miaoda.com domain
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  items jsonb NOT NULL,
  total_amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status order_status NOT NULL DEFAULT 'pending'::order_status,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  customer_email text,
  customer_name text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  project_description text NOT NULL,
  budget_range text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_status ON requests(status);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = uid AND role = 'admin'::user_role
  );
$$;

-- Auto-create profile on user confirmation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (remove @miaoda.com)
  extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
  
  INSERT INTO profiles (id, username, email, role)
  VALUES (
    NEW.id,
    extracted_username,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  RETURN NEW;
END;
$$;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage orders" ON orders
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- RLS Policies for requests
CREATE POLICY "Anyone can insert requests" ON requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own requests" ON requests
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all requests" ON requests
  FOR ALL USING (is_admin(auth.uid()));

-- Public view for profiles (shareable info)
CREATE VIEW public_profiles AS
SELECT
  id,
  username,
  created_at
FROM profiles;
