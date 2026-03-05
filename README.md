# NexusAI - AI SaaS Web Application

NexusAI is a production-ready AI SaaS application built with Next.js 14, Supabase, Groq API (Llama 3), and Stripe. It features a modern, responsive, dark-themed UI with smooth animations.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth (Email/Password & Google OAuth).
- **AI Chat Interface**: Real-time streaming chat responses powered by Groq and Llama 3.1.
- **Subscription Management**: Stripe integration for handling free and premium (Pro/Enterprise) subscription plans.
- **Chat History**: Save and resume past conversations.
- **Modern UI/UX**: Built with Tailwind CSS, shadcn/ui, and Framer Motion for a premium dark mode experience.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, shadcn/ui.
- **Backend/Database**: Supabase (PostgreSQL, Auth, RLS).
- **AI Provider**: Groq API.
- **Payments**: Stripe.
- **Deployment**: Vercel.

---

## Setup Instructions

### 1. Project Initialization

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and add the following based on your setup:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Migration (Supabase)

Navigate to your Supabase project dashboard and go to the **SQL Editor**.
Run the SQL queries found in `supabase/migrations/20260305_init.sql` to create the required tables (`chats`, `messages`, `subscriptions`) and set up Row Level Security (RLS) policies.

Alternatively, if you use the Supabase CLI:

```bash
npx supabase link --project-ref your_project_ref
npx supabase db push
```

### 4. Stripe Setup Guide

To enable payments:

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Create a new Product called `NexusAI Pro`.
3. Add a recurring pricing plan (e.g., $10 / month).
4. Note the Price ID (looks like `price_12345...`) and update it in `src/lib/stripe/index.ts`.
5. Create a webhook endpoint in Stripe:
   - URL: `https://your-domain.com/api/stripe/webhook` (For local testing, use the Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`).
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
6. Get the **Webhook Secret** and place it in your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### 5. Running the App Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## Deployment Guide for Vercel

NexusAI is designed to be easily deployed on Vercel.

1. Create a GitHub repository and push your local code.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
3. Import your GitHub repository.
4. Open the **Environment Variables** section in the Vercel project setup.
5. Add all the variables from your `.env.local` (ensure `NEXT_PUBLIC_APP_URL` points to your production Vercel domain, e.g., `https://nexusai.vercel.app`).
6. Click **Deploy**. Vercel will install dependencies, build the Next.js application, and deploy it.
7. Don't forget to update your Google OAuth Authorized redirect URIs and Stripe Webhook URLs with the fresh production domain.

---

_Built by a Senior Full-Stack Engineer._
