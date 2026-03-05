import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "Blog — NexusAI" };

const posts = [
  {
    slug: "introducing-nexusai",
    title: "Introducing NexusAI: The Fastest AI Chat Platform",
    excerpt: "Today we're launching NexusAI — a platform built from the ground up for speed, privacy, and real-world usefulness.",
    date: "March 1, 2026",
    category: "Announcements",
    readTime: "3 min read",
  },
  {
    slug: "how-we-achieve-200ms-responses",
    title: "How We Achieve Sub-200ms AI Responses",
    excerpt: "A deep dive into the infrastructure and optimizations that let NexusAI respond faster than any competitor.",
    date: "February 20, 2026",
    category: "Engineering",
    readTime: "7 min read",
  },
  {
    slug: "ai-for-developers",
    title: "Using AI to 10x Your Development Workflow",
    excerpt: "Practical tips and prompts for developers to get the most out of AI assistants in their daily work.",
    date: "February 10, 2026",
    category: "Guides",
    readTime: "5 min read",
  },
  {
    slug: "privacy-first-ai",
    title: "Why Privacy-First AI Is Non-Negotiable",
    excerpt: "We explain our stance on data privacy and why we'll never train models on your personal conversations.",
    date: "January 28, 2026",
    category: "Company",
    readTime: "4 min read",
  },
  {
    slug: "prompt-engineering-101",
    title: "Prompt Engineering 101: Get Better Answers Every Time",
    excerpt: "Learn the simple techniques that transform vague questions into precise, useful AI responses.",
    date: "January 15, 2026",
    category: "Guides",
    readTime: "6 min read",
  },
  {
    slug: "nexusai-pro-features",
    title: "What's New in NexusAI Pro",
    excerpt: "A full breakdown of everything included in our Pro plan — and why power users are loving it.",
    date: "January 5, 2026",
    category: "Product",
    readTime: "4 min read",
  },
];

const categoryColors: Record<string, string> = {
  Announcements: "bg-primary/10 text-primary",
  Engineering: "bg-blue-500/10 text-blue-400",
  Guides: "bg-green-500/10 text-green-400",
  Company: "bg-purple-500/10 text-purple-400",
  Product: "bg-orange-500/10 text-orange-400",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-muted-foreground text-lg">
              Thoughts on AI, engineering, and building the future.
            </p>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="p-6 rounded-2xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="text-xs text-muted-foreground">· {post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
                <div className="mt-4">
                  <Link href={`/blog/${post.slug}`} className="text-sm text-primary hover:underline">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
