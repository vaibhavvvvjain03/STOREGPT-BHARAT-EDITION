/*
  # StoreGPT: Bharat Edition - Core Database Schema

  1. New Tables
    - `users` - Shop owners and their profiles
      - `id` (uuid, primary key from auth)
      - `email` (text, unique)
      - `shop_name` (text)
      - `shop_description` (text)
      - `preferred_language` (text)
      - `festival_mode_enabled` (boolean)
      - `location` (text)
      - `upi_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `products` - Store products
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `category` (text)
      - `price` (numeric)
      - `description` (text)
      - `image_url` (text)
      - `in_store` (boolean)
      - `created_at` (timestamp)

    - `ledger_entries` - Khata (voice ledger) entries
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `customer_name` (text)
      - `amount` (numeric)
      - `entry_type` (text - 'credit' or 'debit')
      - `notes` (text)
      - `created_at` (timestamp)

    - `analytics` - Store analytics data
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `visitors` (integer)
      - `sales` (numeric)
      - `date` (date)
      - `created_at` (timestamp)

    - `store_config` - Store configurations
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `store_url` (text)
      - `theme_color` (text)
      - `categories` (jsonb)
      - `updated_at` (timestamp)

    - `categories` - Product categories lookup
      - `id` (uuid, primary key)
      - `name` (text)
      - `keywords` (text[])
      - `color` (text)
      - `icon` (text)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Public read access for published stores

  3. Indexes
    - Improve query performance on frequently accessed columns
*/

-- Create categories table first (no dependencies)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  keywords text[] DEFAULT '{}',
  color text DEFAULT '#6366f1',
  icon text DEFAULT 'shopping-bag',
  created_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  shop_name text NOT NULL DEFAULT 'My Store',
  shop_description text,
  preferred_language text DEFAULT 'en',
  festival_mode_enabled boolean DEFAULT false,
  location text,
  upi_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  price numeric DEFAULT 0,
  description text,
  image_url text,
  in_store boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create ledger_entries table
CREATE TABLE IF NOT EXISTS ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  amount numeric NOT NULL,
  entry_type text CHECK (entry_type IN ('credit', 'debit')) DEFAULT 'credit',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  visitors integer DEFAULT 0,
  sales numeric DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create store_config table
CREATE TABLE IF NOT EXISTS store_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_url text UNIQUE,
  theme_color text DEFAULT '#1f2937',
  categories jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for products table
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for ledger_entries table
CREATE POLICY "Users can view own ledger"
  ON ledger_entries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own ledger entries"
  ON ledger_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own ledger entries"
  ON ledger_entries FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own ledger entries"
  ON ledger_entries FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for analytics table
CREATE POLICY "Users can view own analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own analytics"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own analytics"
  ON analytics FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for store_config table
CREATE POLICY "Users can view own store config"
  ON store_config FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own store config"
  ON store_config FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own store config"
  ON store_config FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for categories table (public read)
CREATE POLICY "Everyone can view categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_ledger_user_id ON ledger_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at ON ledger_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_store_config_user_id ON store_config(user_id);

-- Insert default categories
INSERT INTO categories (name, keywords, color, icon) VALUES
  ('Cafe', ARRAY['chai', 'tea', 'coffee', 'chai ki dukaan', 'koffee'], '#f97316', 'coffee'),
  ('Fashion', ARRAY['saree', 'dupatta', 'kurti', 'dress', 'fabric', 'kapda'], '#ec4899', 'dress'),
  ('Tech', ARRAY['mobile', 'phone', 'gadget', 'charger', 'laptop', 'electronic'], '#06b6d4', 'smartphone'),
  ('Grocery', ARRAY['dal', 'rice', 'spice', 'namkeen', 'khana', 'chawal'], '#84cc16', 'shopping-bag'),
  ('Jewelry', ARRAY['jewelry', 'bangle', 'necklace', 'earring', 'ring'], '#fbbf24', 'gem'),
  ('Stationery', ARRAY['books', 'notebook', 'pen', 'pencil', 'kitaab'], '#a78bfa', 'book-open'),
  ('Beauty', ARRAY['makeup', 'cosmetics', 'skincare', 'sundar', 'mehendi'], '#fb7185', 'sparkles'),
  ('Home', ARRAY['furniture', 'home', 'kitchen', 'utensil', 'ghar'], '#10b981', 'home'),
  ('Sports', ARRAY['sports', 'fitness', 'yoga', 'gym', 'khel'], '#3b82f6', 'activity'),
  ('Health', ARRAY['medicine', 'health', 'pharmacy', 'tablet', 'swasth'], '#06b6d4', 'heart')
ON CONFLICT (name) DO NOTHING;
