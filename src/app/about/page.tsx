import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Users, Zap, Shield } from "lucide-react";

export const metadata = { title: "About — NexusAI" };

const team = [
  { name: "Alex Carter", role: "CEO & Co-Founder", initials: "AC" },
  { name: "Jordan Lee", role: "CTO & Co-Founder", initials: "JL" },
  { name: "Sam Rivera", role: "Head of AI Research", initials: "SR" },
  { name: "Morgan Chen", role: "Head of Design", initials: "MC" },
];

const values = [
  { icon: Zap, title: "Speed First", description: "We obsess over response times. Every millisecond matters when you're in the flow of work." },
  { icon: Shield, title: "Privacy by Default", description: "Your conversations are yours. We never train on your data or sell your information." },
  { icon: Users, title: "Built for Everyone", description: "From developers to writers to executives — NexusAI adapts to how you think and work." },
  { icon: Sparkles, title: "Always Improving", description: "We ship updates constantly, pushing the frontier of what AI conversation can do." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            We&apos;re building the future of{" "}
            <span className="gradient-text">AI conversation</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            NexusAI was founded in 2024 with a simple mission: make powerful AI accessible to everyone. We believe the best AI isn&apos;t just smart — it&apos;s fast, private, and genuinely useful.
          </p>
        </section>

        {/* Values */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h2 className="text-2xl font-bold text-center mb-12">What we believe in</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-2xl border border-border bg-secondary/20">
                <div className="inline-flex p-2.5 rounded-xl bg-primary/10 mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Meet the team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {member.initials}
                </div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
