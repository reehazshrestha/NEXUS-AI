import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Cookie Policy — NexusAI" };

const cookieTypes = [
  {
    name: "Essential Cookies",
    required: true,
    description: "These cookies are necessary for the website to function and cannot be disabled. They are usually set in response to actions you take such as logging in or filling in forms.",
    examples: ["Session authentication", "CSRF protection", "Load balancing"],
  },
  {
    name: "Analytics Cookies",
    required: false,
    description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the platform.",
    examples: ["Page view tracking", "Feature usage metrics", "Performance monitoring"],
  },
  {
    name: "Preference Cookies",
    required: false,
    description: "These cookies allow us to remember your preferences and settings to provide a more personalized experience.",
    examples: ["Theme preferences", "Language settings", "Sidebar state"],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: March 1, 2026</p>
          </div>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed mb-12">
            <p>
              NexusAI uses cookies and similar tracking technologies to improve your experience on our platform. This policy explains what cookies are, which ones we use, and how you can control them.
            </p>
            <p>
              A cookie is a small text file placed on your device by a website. Cookies help websites remember your preferences, keep you logged in, and understand how you use the site.
            </p>
          </div>

          <div className="space-y-6">
            {cookieTypes.map((type) => (
              <div key={type.name} className="p-6 rounded-2xl border border-border bg-secondary/10">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-semibold">{type.name}</h2>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${type.required ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {type.required ? "Always Active" : "Optional"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                <div>
                  <p className="text-xs font-medium text-foreground mb-2">Examples:</p>
                  <ul className="space-y-1">
                    {type.examples.map((ex) => (
                      <li key={ex} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-10 space-y-4 text-sm text-muted-foreground">
            <h2 className="text-lg font-semibold text-foreground">Managing Cookies</h2>
            <p>
              You can control and delete cookies through your browser settings. Note that disabling essential cookies may affect the functionality of NexusAI. Most browsers allow you to refuse cookies, delete existing cookies, or be notified when a new cookie is set.
            </p>
            <p>
              For questions about our cookie practices, contact us at{" "}
              <a href="mailto:privacy@nexusai.com" className="text-primary hover:underline">privacy@nexusai.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
