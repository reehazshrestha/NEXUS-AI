import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronRight, MessageSquare, CreditCard, Shield, Zap, Settings, Users } from "lucide-react";

export const metadata = { title: "Help Center — NexusAI" };

const categories = [
  {
    icon: MessageSquare,
    title: "Getting Started",
    articles: ["How to create your first chat", "Using the AI effectively", "Keyboard shortcuts", "Understanding message limits"],
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    articles: ["Upgrading to Pro", "Managing your subscription", "Payment methods accepted", "Requesting a refund"],
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    articles: ["How your data is protected", "Deleting your account", "Two-factor authentication", "Data export"],
  },
  {
    icon: Zap,
    title: "Features",
    articles: ["Streaming responses explained", "Chat history and search", "Regenerating responses", "Stopping a generation"],
  },
  {
    icon: Settings,
    title: "Account Settings",
    articles: ["Changing your email", "Updating your password", "Notification preferences", "Connected integrations"],
  },
  {
    icon: Users,
    title: "Teams & Collaboration",
    articles: ["Team plan overview", "Inviting team members", "Shared conversation history", "Admin controls"],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-muted-foreground text-lg mb-8">How can we help you?</p>
            <div className="max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full px-5 py-3 rounded-2xl border border-border bg-secondary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.title} className="p-6 rounded-2xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <cat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-semibold">{cat.title}</h2>
                </div>
                <ul className="space-y-2">
                  {cat.articles.map((article) => (
                    <li key={article}>
                      <Link href="#" className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors group">
                        <span>{article}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Still need help */}
          <div className="mt-16 text-center p-8 rounded-2xl border border-border bg-secondary/10">
            <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
            <p className="text-muted-foreground text-sm mb-4">Our support team typically responds within 24 hours.</p>
            <Link href="/contact" className="text-primary hover:underline text-sm font-medium">
              Contact Support →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
