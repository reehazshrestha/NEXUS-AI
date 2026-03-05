import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    description: "Get started with basic AI chat",
    price: 0,
    messages_per_day: 10,
    features: [
      "10 messages per day",
      "Basic AI responses",
      "Standard response speed",
      "Community support",
    ],
  },
  pro: {
    name: "Pro",
    description: "Unlimited access for power users",
    price: 10,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    messages_per_day: -1, // unlimited
    features: [
      "Unlimited messages",
      "Priority AI responses",
      "Faster response speed",
      "Chat history export",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    description: "Custom solutions for your team",
    price: null,
    messages_per_day: -1,
    features: [
      "Everything in Pro",
      "Custom AI training",
      "Dedicated account manager",
      "API access",
      "SLA guarantee",
      "Custom integrations",
    ],
  },
} as const;
