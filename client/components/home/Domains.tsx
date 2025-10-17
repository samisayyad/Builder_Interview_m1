import { Link } from "react-router-dom";
import {
  Code2,
  Brain,
  BarChart3,
  Boxes,
  ServerCog,
  Cloud,
  Shield,
  Megaphone,
  Banknote,
  HeartPulse,
  Handshake,
  Workflow,
  Presentation,
  Rocket,
  User2,
} from "lucide-react";

const companies = [
  "Google",
  "Amazon",
  "Microsoft",
  "Stripe",
  "Coinbase",
  "Airbnb",
];
const domains = [
  { name: "Software Development", icon: Code2 },
  { name: "Data Science", icon: BarChart3 },
  { name: "Machine Learning", icon: Brain },
  { name: "Product Management", icon: Boxes },
  { name: "System Design", icon: ServerCog },
  { name: "DevOps & Cloud", icon: Cloud },
  { name: "Cybersecurity", icon: Shield },
  { name: "Digital Marketing", icon: Megaphone },
  { name: "Finance & Banking", icon: Banknote },
  { name: "Healthcare Tech", icon: HeartPulse },
  { name: "Sales & BD", icon: Handshake },
  { name: "Operations Management", icon: Workflow },
  { name: "Consulting", icon: Presentation },
  { name: "Startup & Entrepreneurship", icon: Rocket },
  { name: "HR", icon: User2 },
];

export default function Domains() {
  return (
    <section className="container py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by professionals at
        </p>
        <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-4">
          {companies.map((c) => (
            <div
              key={c}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors grayscale hover:grayscale-0 select-none border rounded-md py-2"
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold">15+ Interview Domains</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {domains.map((d) => (
            <Link
              key={d.name}
              to={`/interview?domain=${encodeURIComponent(d.name)}`}
              className="rounded-lg border bg-card p-4 text-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-2">
                <d.icon className="h-4 w-4 text-primary" />
                <div className="font-medium group-hover:text-foreground">
                  {d.name}
                </div>
              </div>
              <div className="mt-1 text-muted-foreground">
                100+ MCQs •{" "}
                <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs">
                  Easy → Expert
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
