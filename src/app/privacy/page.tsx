import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy — NexusAI" };

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account (name, email address, password), send messages through our service, or contact us for support. We also automatically collect certain technical information when you use NexusAI, including your IP address, browser type, operating system, and usage patterns.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve our services; authenticate you and process transactions; send you technical notices and support messages; respond to your comments and questions; and monitor and analyze usage trends to improve the platform.`,
  },
  {
    title: "3. We Do Not Train On Your Data",
    content: `NexusAI does not use your conversations or personal data to train AI models. Your messages are processed solely to generate responses and are not retained for model training purposes. This is a core commitment we make to all users.`,
  },
  {
    title: "4. Information Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform (such as cloud infrastructure providers), subject to confidentiality agreements. We may also disclose information when required by law.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your account information and conversation history for as long as your account is active or as needed to provide services. You may delete your account at any time through the settings page, which will permanently delete your data within 30 days.`,
  },
  {
    title: "6. Security",
    content: `We implement industry-standard security measures including encryption in transit (TLS) and at rest, regular security audits, and strict access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "7. Cookies",
    content: `We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze how our service is used. You can control cookie settings through your browser. See our Cookie Policy for more details.`,
  },
  {
    title: "8. Your Rights",
    content: `Depending on your location, you may have rights to access, correct, delete, or export your personal data. To exercise these rights, contact us at privacy@nexusai.com. We will respond to verified requests within 30 days.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a prominent notice in our service. Your continued use of NexusAI after changes take effect constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have questions about this Privacy Policy or our data practices, contact us at privacy@nexusai.com or write to: NexusAI, Privacy Team, [Address].`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 1, 2026</p>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-10">
            NexusAI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-lg font-semibold mb-3">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{s.content}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
