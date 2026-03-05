import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Terms of Service — NexusAI" };

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using NexusAI, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any changes.`,
  },
  {
    title: "2. Account Registration",
    content: `To access certain features of NexusAI, you must create an account. You agree to provide accurate, current, and complete information, maintain the security of your password, and accept responsibility for all activities under your account. You must be at least 13 years of age to create an account.`,
  },
  {
    title: "3. Acceptable Use",
    content: `You agree not to use NexusAI to: generate or distribute illegal, harmful, or offensive content; attempt to hack, reverse-engineer, or disrupt our systems; impersonate any person or entity; send spam or unsolicited messages; violate any applicable laws or regulations; or use the service to infringe on the intellectual property rights of others.`,
  },
  {
    title: "4. Subscription and Billing",
    content: `NexusAI offers free and paid subscription plans. Paid plans are billed monthly or annually as selected. You authorize us to charge your payment method for the applicable fees. Subscriptions auto-renew unless cancelled before the renewal date. Refunds are provided at our discretion.`,
  },
  {
    title: "5. Intellectual Property",
    content: `NexusAI and its original content, features, and functionality are owned by NexusAI and protected by intellectual property laws. The AI-generated content you receive through our service is provided for your use, but we make no ownership claims over your input data or the resulting outputs.`,
  },
  {
    title: "6. Disclaimer of Warranties",
    content: `NexusAI is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or completely secure. AI-generated content may contain inaccuracies — always verify important information.`,
  },
  {
    title: "7. Limitation of Liability",
    content: `To the maximum extent permitted by law, NexusAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    title: "8. Termination",
    content: `We reserve the right to suspend or terminate your account at any time for violations of these terms, with or without notice. You may delete your account at any time through the settings page. Upon termination, your right to use the service ceases immediately.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these terms or your use of NexusAI shall be resolved through binding arbitration, except where prohibited by law.`,
  },
  {
    title: "10. Contact",
    content: `For questions about these Terms of Service, contact us at legal@nexusai.com.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: March 1, 2026</p>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Please read these Terms of Service carefully before using NexusAI. These terms govern your access to and use of our platform.
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
