import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code2, Key, Zap, Shield } from "lucide-react";

export const metadata = { title: "API — NexusAI" };

const endpoints = [
  { method: "POST", path: "/v1/chat/completions", desc: "Send a message and receive a streaming AI response." },
  { method: "GET", path: "/v1/chats", desc: "List all chat sessions for the authenticated user." },
  { method: "POST", path: "/v1/chats", desc: "Create a new chat session." },
  { method: "DELETE", path: "/v1/chats/:id", desc: "Delete a chat session and all its messages." },
  { method: "GET", path: "/v1/chats/:id/messages", desc: "Retrieve all messages in a chat session." },
];

const methodColors: Record<string, string> = {
  GET: "text-green-400 bg-green-500/10",
  POST: "text-blue-400 bg-blue-500/10",
  DELETE: "text-red-400 bg-red-500/10",
};

const features = [
  { icon: Zap, title: "Streaming Responses", desc: "Real-time token streaming via Server-Sent Events." },
  { icon: Key, title: "API Key Auth", desc: "Simple Bearer token authentication on every request." },
  { icon: Shield, title: "Rate Limiting", desc: "Fair use limits with clear headers so you can plan ahead." },
  { icon: Code2, title: "OpenAI Compatible", desc: "Familiar request/response format for easy migration." },
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-14">
            <h1 className="text-4xl font-bold mb-4">
              NexusAI <span className="gradient-text">API</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Build AI-powered applications with the NexusAI API. Simple, fast, and OpenAI-compatible.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-secondary/10">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick start */}
          <section className="mb-14">
            <h2 className="text-xl font-bold mb-4">Quick Start</h2>
            <div className="rounded-2xl border border-border bg-[#0d0d0d] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">curl</span>
              </div>
              <pre className="p-5 text-xs text-green-400 font-mono overflow-x-auto leading-relaxed whitespace-pre">{`curl https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "role": "user", "content": "Hello, NexusAI!" }
    ],
    "stream": true
  }'`}</pre>
            </div>
          </section>

          {/* Endpoints */}
          <section className="mb-14">
            <h2 className="text-xl font-bold mb-4">Endpoints</h2>
            <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
              {endpoints.map((ep) => (
                <div key={`${ep.method}-${ep.path}`} className="flex items-start gap-4 px-5 py-4 bg-secondary/10">
                  <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md flex-shrink-0 ${methodColors[ep.method]}`}>
                    {ep.method}
                  </span>
                  <div>
                    <code className="text-sm font-mono text-foreground">{ep.path}</code>
                    <p className="text-xs text-muted-foreground mt-0.5">{ep.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Get API key */}
          <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 text-center">
            <h2 className="font-semibold mb-2">Ready to build?</h2>
            <p className="text-sm text-muted-foreground mb-4">Get your API key from the dashboard settings.</p>
            <a
              href="/settings"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <Key className="w-4 h-4" /> Get your API key →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
