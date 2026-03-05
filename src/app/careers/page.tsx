import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Clock, ArrowRight } from "lucide-react";

export const metadata = { title: "Careers — NexusAI" };

const openings = [
  { title: "Senior AI/ML Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Full-Stack Engineer (Next.js)", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time" },
  { title: "Developer Advocate", team: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Head of Growth", team: "Marketing", location: "Remote", type: "Full-time" },
];

const perks = [
  { title: "Fully Remote", desc: "Work from anywhere in the world." },
  { title: "Competitive Salary", desc: "Top-of-market compensation + equity." },
  { title: "Unlimited PTO", desc: "We trust you to manage your time." },
  { title: "Learning Budget", desc: "$2,000/year for courses, books, and conferences." },
  { title: "Health Coverage", desc: "Full medical, dental, and vision." },
  { title: "Latest Equipment", desc: "MacBook Pro + any peripherals you need." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Join the team building the{" "}
              <span className="gradient-text">future of AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;re a small, ambitious team moving fast. If you love hard problems and want your work to matter, we&apos;d love to talk.
            </p>
          </div>

          {/* Perks */}
          <section className="mb-16">
            <h2 className="text-xl font-bold mb-6">Why NexusAI</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {perks.map((perk) => (
                <div key={perk.title} className="p-4 rounded-xl border border-border bg-secondary/10">
                  <p className="font-semibold text-sm mb-1">{perk.title}</p>
                  <p className="text-sm text-muted-foreground">{perk.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Open Roles */}
          <section>
            <h2 className="text-xl font-bold mb-6">Open Roles</h2>
            <div className="space-y-3">
              {openings.map((role) => (
                <div
                  key={role.title}
                  className="flex items-center justify-between p-5 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors group cursor-pointer"
                >
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">{role.title}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-xs text-muted-foreground">{role.team}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {role.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {role.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6 text-center">
              Don&apos;t see your role? Email us at{" "}
              <a href="mailto:careers@nexusai.com" className="text-primary hover:underline">
                careers@nexusai.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
