"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 mb-5">
              Choose your
              <br />
              <span className="gradient-text">perfect plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and scale up as you grow. All plans include core AI
              features with no hidden fees.
            </p>
          </motion.div>

          <PricingCards />

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-24 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-10">
              Frequently asked questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Can I switch plans at any time?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, debit cards, and regional payment methods through Stripe.",
                },
                {
                  q: "Is there a free trial for Pro?",
                  a: "We don't offer a trial, but our Free plan lets you experience NexusAI with 10 messages per day at no cost.",
                },
                {
                  q: "Can I cancel my subscription?",
                  a: "Yes, you can cancel anytime from your Settings page. You'll retain access until the end of your billing period.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
