import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap } from "lucide-react";

export const metadata = { title: "Integrations — NexusAI" };

const integrations = [
  { name: "Slack", category: "Communication", status: "available", desc: "Chat with NexusAI directly inside Slack channels and DMs." },
  { name: "VS Code", category: "Developer Tools", status: "available", desc: "AI code assistance right inside your editor." },
  { name: "Notion", category: "Productivity", status: "available", desc: "Generate and summarize content in your Notion workspace." },
  { name: "Zapier", category: "Automation", status: "available", desc: "Connect NexusAI to 5,000+ apps with no code." },
  { name: "GitHub", category: "Developer Tools", status: "coming_soon", desc: "Code review suggestions and PR summaries powered by AI." },
  { name: "Google Docs", category: "Productivity", status: "coming_soon", desc: "Write, rewrite, and summarize documents with AI assistance." },
  { name: "Jira", category: "Project Management", status: "coming_soon", desc: "Generate ticket descriptions and sprint summaries automatically." },
  { name: "Discord", category: "Communication", status: "coming_soon", desc: "Add NexusAI as a bot to your Discord server." },
];

const categoryColors: Record<string, string> = {
  Communication: "bg-blue-500/10 text-blue-400",
  "Developer Tools": "bg-green-500/10 text-green-400",
  Productivity: "bg-purple-500/10 text-purple-400",
  Automation: "bg-orange-500/10 text-orange-400",
  "Project Management": "bg-pink-500/10 text-pink-400",
};

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Connect NexusAI to your{" "}
              <span className="gradient-text">favorite tools</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Bring AI into the tools you already use every day. No switching required.
            </p>
          </div>

          {/* Available */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-5">Available Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {integrations.filter((i) => i.status === "available").map((integration) => (
                <div
                  key={integration.name}
                  className="p-5 rounded-2xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                        {integration.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{integration.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[integration.category]}`}>
                          {integration.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-green-400 font-medium">Connect →</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{integration.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Coming soon */}
          <section>
            <h2 className="text-lg font-semibold mb-5">Coming Soon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {integrations.filter((i) => i.status === "coming_soon").map((integration) => (
                <div key={integration.name} className="p-5 rounded-2xl border border-border bg-secondary/5 opacity-70">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center font-bold text-sm text-muted-foreground">
                        {integration.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{integration.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[integration.category]}`}>
                          {integration.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-full bg-secondary border border-border">
                      Soon
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{integration.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Request */}
          <div className="mt-14 text-center p-8 rounded-2xl border border-border bg-secondary/10">
            <h2 className="font-semibold mb-2">Need a specific integration?</h2>
            <p className="text-sm text-muted-foreground mb-3">Let us know what you&apos;d like to connect with NexusAI.</p>
            <a href="/contact" className="text-sm text-primary hover:underline font-medium">
              Request an integration →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
