"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with basic AI chat",
    icon: Sparkles,
    features: [
      "10 messages per day",
      "Basic AI responses",
      "Standard response speed",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    name: "Pro",
    price: "$10",
    period: "/month",
    description: "Unlimited access for power users",
    icon: Zap,
    features: [
      "Unlimited messages",
      "Priority AI responses",
      "Faster response speed",
      "Chat history export",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    gradient: "from-primary to-purple-600",
  },
  {
    name: "Business",
    price: "$25",
    period: "/month",
    description: "Advanced tools for growing teams",
    icon: Building2,
    features: [
      "Everything in Pro",
      "Custom AI training",
      "Dedicated account manager",
      "API access",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Upgrade to Business",
    popular: false,
    gradient: "from-emerald-500 to-teal-600",
  },
];

export default function PricingCards() {
  const router = useRouter();

  const handleSubscribe = async (planName: string) => {
    if (planName === "Free") {
      router.push("/register");
      return;
    }
    // Pro / Business - redirect to checkout
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName.toLowerCase() }),
      });

      if (res.status === 401) {
        router.push(`/login?next=/pricing`);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15, duration: 0.5 }}
          viewport={{ once: true }}
          className={`relative rounded-2xl p-[1px] ${
            plan.popular
              ? "bg-gradient-to-b from-primary/50 to-purple-600/50"
              : "bg-border"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-primary/25">
                Most Popular
              </span>
            </div>
          )}
          <div
            className={`h-full rounded-2xl p-8 ${
              plan.popular
                ? "bg-gradient-to-b from-primary/5 to-background"
                : "bg-card"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${plan.gradient}`}
              >
                <plan.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              {plan.description}
            </p>

            <div className="mb-8">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleSubscribe(plan.name)}
              className={`w-full ${
                plan.popular
                  ? "bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white shadow-lg shadow-primary/25"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
              }`}
              size="lg"
            >
              {plan.cta}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
