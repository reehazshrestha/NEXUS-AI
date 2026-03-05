"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Twitter } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const channels = [
  { icon: Mail, title: "Email", desc: "For general inquiries and partnerships.", value: "hello@nexusai.com", href: "mailto:hello@nexusai.com" },
  { icon: MessageSquare, title: "Support", desc: "Technical issues and account help.", value: "support@nexusai.com", href: "mailto:support@nexusai.com" },
  { icon: Twitter, title: "Twitter / X", desc: "Follow us for updates and announcements.", value: "@NexusAI", href: "#" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Get in touch</h1>
            <p className="text-muted-foreground text-lg">We&apos;d love to hear from you. Reach out through any channel below.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact channels */}
            <div className="space-y-4">
              {channels.map((c) => (
                <a key={c.title} href={c.href} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors group">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                    <p className="text-sm text-primary mt-1">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white"
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
