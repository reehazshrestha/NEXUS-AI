-- Create tables for NexusAI Database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Chats table
create table if not exists public.chats (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null default 'New Chat',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Messages table
create table if not exists public.messages (
    id uuid default uuid_generate_v4() primary key,
    chat_id uuid references public.chats(id) on delete cascade not null,
    role text not null check (role in ('system', 'user', 'assistant')),
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Subscriptions table
create table if not exists public.subscriptions (
    user_id uuid references auth.users(id) on delete cascade primary key,
    stripe_customer_id text,
    plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
    status text not null default 'active',
    renew_date timestamp with time zone
);

-- Set up Row Level Security (RLS)

-- Chats RLS
alter table public.chats enable row level security;
create policy "Users can view their own chats" on public.chats
    for select using (auth.uid() = user_id);
create policy "Users can insert their own chats" on public.chats
    for insert with check (auth.uid() = user_id);
create policy "Users can update their own chats" on public.chats
    for update using (auth.uid() = user_id);
create policy "Users can delete their own chats" on public.chats
    for delete using (auth.uid() = user_id);

-- Messages RLS
alter table public.messages enable row level security;
create policy "Users can view messages in their chats" on public.messages
    for select using (
        chat_id in (select id from public.chats where user_id = auth.uid())
    );
create policy "Users can insert messages in their chats" on public.messages
    for insert with check (
        chat_id in (select id from public.chats where user_id = auth.uid())
    );
create policy "Users can delete messages in their chats" on public.messages
    for delete using (
        chat_id in (select id from public.chats where user_id = auth.uid())
    );

-- Subscriptions RLS
alter table public.subscriptions enable row level security;
create policy "Users can view their own subscription" on public.subscriptions
    for select using (auth.uid() = user_id);
-- Only service role can update/insert subscriptions securely
