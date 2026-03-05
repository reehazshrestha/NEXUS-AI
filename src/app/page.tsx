"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  Shield,
  Monitor,
  MessageSquare,
  ArrowRight,
  Code2,
  Brain,
  Globe,
  ChevronRight,
  Star,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  viewport: { once: true },
};

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Llama 3.1 &amp; Groq</span>
            <ChevronRight className="w-3 h-3" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight"
          >
            Your Intelligent
            <br />
            <span className="gradient-text">AI Companion</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience lightning-fast AI conversations with NexusAI. Get
            intelligent answers, write code, brainstorm ideas, and more — all in
            real-time.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-xl px-8 h-13 text-base shadow-xl shadow-primary/25 group"
              >
                Start Chatting
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 h-13 text-base border-border hover:bg-accent"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex justify-center gap-8 sm:gap-16 mt-16 pt-8 border-t border-border/50"
          >
            {[
              { value: "50K+", label: "Active Users" },
              { value: "10M+", label: "Messages Sent" },
              { value: "<200ms", label: "Avg Response" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5">
              Everything you need in an
              <br />
              <span className="gradient-text">AI assistant</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Built with cutting-edge technology to deliver fast, accurate, and
              secure AI conversations.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: MessageSquare,
                title: "AI Chat",
                description:
                  "Natural conversations powered by Llama 3.1, one of the most capable open-source AI models.",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Powered by Groq's LPU technology for responses in milliseconds, not seconds.",
                gradient: "from-amber-500 to-orange-600",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "End-to-end encryption with enterprise-grade security. Your conversations stay private.",
                gradient: "from-emerald-500 to-green-600",
              },
              {
                icon: Monitor,
                title: "Multi-Device",
                description:
                  "Seamless experience across desktop, tablet, and mobile with full responsive design.",
                gradient: "from-purple-500 to-pink-600",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                />
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 sm:py-32 bg-secondary/20 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5">
              Start chatting in
              <br />
              <span className="gradient-text">three simple steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                icon: Globe,
                title: "Create Account",
                description:
                  "Sign up in seconds with your email or Google account. No credit card required.",
              },
              {
                step: "02",
                icon: Code2,
                title: "Start Chatting",
                description:
                  "Ask questions, write code, brainstorm ideas, or have natural conversations.",
              },
              {
                step: "03",
                icon: Brain,
                title: "Get AI Insights",
                description:
                  "Receive intelligent, contextual responses powered by cutting-edge AI technology.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="text-7xl font-bold text-primary/10 mb-4">
                  {item.step}
                </div>
                <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5">
              Simple, transparent
              <br />
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Start free and upgrade when you need more. No hidden fees, no
              surprises.
            </p>
          </motion.div>

          <PricingCards />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 bg-secondary/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-5">
              Loved by <span className="gradient-text">developers</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Senior Developer",
                company: "TechCorp",
                content:
                  "NexusAI has completely transformed my workflow. The code generation is incredibly accurate and the response time is unmatched.",
                avatar: "SC",
              },
              {
                name: "Marcus Johnson",
                role: "Product Manager",
                company: "StartupXYZ",
                content:
                  "The best AI assistant I've used. It understands context perfectly and the streaming responses make it feel like a real conversation.",
                avatar: "MJ",
              },
              {
                name: "Emily Rodriguez",
                role: "Data Scientist",
                company: "DataFlow",
                content:
                  "From complex data analysis to writing reports, NexusAI handles everything. The Pro plan is absolutely worth it.",
                avatar: "ER",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />

        <motion.div
          {...fadeInUp}
          className="relative z-10 max-w-3xl mx-auto px-4 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to experience the
            <br />
            <span className="gradient-text">future of AI?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of users already having smarter conversations with
            NexusAI.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-xl px-10 h-14 text-lg shadow-xl shadow-primary/25 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
