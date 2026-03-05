import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageSquare, Star, Users, ExternalLink } from "lucide-react";

export const metadata = { title: "Community — NexusAI" };

const channels = [
  {
    icon: MessageSquare,
    name: "Discord Server",
    desc: "Join 5,000+ members to share prompts, get help, and give feedback directly to the team.",
    cta: "Join Discord",
    href: "#",
    badge: "Most Active",
  },
  {
    icon: Star,
    name: "GitHub Discussions",
    desc: "Feature requests, bug reports, and open-source contributions. Help shape the roadmap.",
    cta: "Visit GitHub",
    href: "#",
    badge: null,
  },
  {
    icon: Users,
    name: "Reddit Community",
    desc: "r/NexusAI — tips, use cases, and discussions from real users.",
    cta: "Join Subreddit",
    href: "#",
    badge: null,
  },
];

const showcases = [
  { title: "Build a research assistant with NexusAI", author: "dev_marcos", likes: 284 },
  { title: "My prompt template for writing code reviews", author: "sarah_codes", likes: 197 },
  { title: "Using NexusAI for daily journaling prompts", author: "mindful_writer", likes: 156 },
  { title: "Automating email drafts with structured prompts", author: "productivepro", likes: 143 },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              Join the <span className="gradient-text">NexusAI Community</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Connect with thousands of users, share what you&apos;re building, and help make NexusAI better.
            </p>
          </div>

          {/* Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {channels.map((c) => (
              <div key={c.name} className="p-6 rounded-2xl border border-border bg-secondary/10 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  {c.badge && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {c.badge}
                    </span>
                  )}
                </div>
                <h2 className="font-semibold mb-2">{c.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{c.desc}</p>
                <a
                  href={c.href}
                  className="mt-4 flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                >
                  {c.cta} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Community showcase */}
          <div>
            <h2 className="text-xl font-bold mb-6">Community Showcase</h2>
            <div className="space-y-3">
              {showcases.map((item) => (
                <div key={item.title} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">by {item.author}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    {item.likes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
