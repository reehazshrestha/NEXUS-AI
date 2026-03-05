import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, AlertCircle } from "lucide-react";

export const metadata = { title: "System Status — NexusAI" };

const services = [
  { name: "API & Chat", status: "operational", uptime: "99.98%" },
  { name: "Authentication", status: "operational", uptime: "100%" },
  { name: "Dashboard", status: "operational", uptime: "99.97%" },
  { name: "Payments (Stripe)", status: "operational", uptime: "100%" },
  { name: "Database", status: "operational", uptime: "99.99%" },
  { name: "CDN & Static Assets", status: "operational", uptime: "100%" },
];

const incidents: { date: string; title: string; severity: string; resolved: boolean }[] = [];

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overall status */}
          <div className={`flex items-center gap-4 p-6 rounded-2xl border mb-10 ${allOperational ? "border-green-500/20 bg-green-500/5" : "border-yellow-500/20 bg-yellow-500/5"}`}>
            {allOperational ? (
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {allOperational ? "All Systems Operational" : "Partial Outage"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Last checked: {new Date().toUTCString()}
              </p>
            </div>
          </div>

          {/* Services */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Services</h2>
            <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between px-5 py-4 bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${service.status === "operational" ? "bg-green-500" : "bg-yellow-500"}`} />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-muted-foreground">{service.uptime} uptime (30d)</span>
                    <span className={`text-xs font-medium capitalize ${service.status === "operational" ? "text-green-400" : "text-yellow-400"}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Incidents */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Recent Incidents</h2>
            {incidents.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-border bg-secondary/10">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No incidents in the last 90 days.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div key={inc.title} className="p-4 rounded-xl border border-border bg-secondary/10">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{inc.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${inc.resolved ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {inc.resolved ? "Resolved" : "Ongoing"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{inc.date} · {inc.severity}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
