import MainLayout from "@/components/layout/MainLayout";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function generateCatalog() {
  const base = [
    "Software Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Cloud",
    "Cybersecurity",
    "HR",
    "Sales",
    "Finance",
    "Marketing",
    "Civil Engineering",
    "Mechanical",
    "Electrical",
    "Product",
    "Design",
    "Support",
    "Operations",
    "Healthcare",
    "Biotech",
    "Energy",
  ];
  const list: { name: string }[] = [];
  for (let i = 0; i < 120; i++) {
    const name = base[i % base.length] + " " + (Math.floor(i / base.length) + 1);
    list.push({ name });
  }
  return list;
}

const catalog = generateCatalog();

const curatedTopics: Record<string, string[]> = {
  "Software Development": ["Data Structures", "Algorithms", "System Design", "Concurrency", "Testing"],
  "Data Science": ["Statistics", "Feature Engineering", "Model Evaluation", "Time Series", "Experimentation"],
  "Machine Learning": ["Supervised Learning", "Unsupervised Learning", "Deep Learning", "Regularization", "Optimization"],
  DevOps: ["CI/CD", "Containers", "Kubernetes", "Monitoring", "IaC"],
  Cloud: ["AWS", "GCP", "Azure", "Multi-Region", "Cost Optimization"],
  Cybersecurity: ["OWASP", "Zero Trust", "IAM", "Network Security", "Threat Modeling"],
  HR: ["Behavioral Interviews", "Conflict Resolution", "Hiring Metrics", "Onboarding", "Compliance"],
  Sales: ["Lead Qualification", "Funnel", "Objections", "Discovery", "Closing"],
  Finance: ["NPV", "IRR", "Risk", "Valuation", "Derivatives"],
  Marketing: ["A/B Testing", "SEO", "Branding", "Content", "Attribution"],
  "Civil Engineering": ["Soil Testing", "Structures", "Materials", "Hydraulics", "Transportation"],
  Mechanical: ["Thermodynamics", "Heat Transfer", "Mechanics", "Manufacturing", "Maintenance"],
  Electrical: ["AC/DC", "Power Systems", "Electronics", "Protection", "Renewables"],
  Product: ["PMF", "Prioritization", "PRD", "User Research", "Roadmaps"],
  Design: ["Visual Hierarchy", "UX Research", "Accessibility", "Design Systems", "Interaction"],
  Support: ["Incident Management", "Knowledge Base", "SLAs", "Escalation", "CSAT/NPS"],
  Operations: ["Lean", "Six Sigma", "Capacity Planning", "Supply Chain", "Quality"],
  Healthcare: ["HIPAA", "Care Pathways", "EMR", "Outcomes", "Telehealth"],
  Biotech: ["CRISPR", "Clinical Trials", "Bioprocess", "Regulatory", "Assays"],
  Energy: ["Grid", "Batteries", "Demand Response", "Solar", "Wind"],
};

function baseName(name: string) {
  return name.replace(/\s+\d+$/, "");
}

function googleLink(domain: string, topic?: string) {
  const q = topic ? `${domain} ${topic} interview` : `${domain} interview topics`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

function makeQuestions(domain: string, topic?: string) {
  const d = baseName(domain);
  const t = topic || "General";
  return [
    `Explain ${t} in ${d} and why it's important.`,
    `Common pitfalls in ${t} for ${d} and how to avoid them?`,
    `Walk through a recent project applying ${t} in ${d}.`,
    `How do you measure success for ${t} in ${d}?`,
    `What advanced concepts in ${t} should a ${d} candidate know?`,
  ];
}

function makeSubtopics(topic?: string) {
  const base = (topic || "Topic").trim();
  return [
    `${base} basics`,
    `${base} advanced`,
    `${base} best practices`,
    `${base} common pitfalls`,
    `${base} interview questions`,
  ];
}

export default function Practice() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const filtered = useMemo(
    () => catalog.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).slice(0, 48),
    [q],
  );

  const currentDomain = filtered[active]?.name || catalog[0].name;
  const domainBase = baseName(currentDomain);
  const topics = curatedTopics[domainBase] || ["Fundamentals", "Advanced", "Best Practices", "Tools", "Trends"];

  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const topicQuestions = useMemo(() => makeQuestions(domainBase, selectedTopic || undefined), [domainBase, selectedTopic]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  const [answer, setAnswer] = useState("");

  return (
    <MainLayout>
      <section className="container py-10 grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Input placeholder="Search domains..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="max-h-[60vh] overflow-auto divide-y rounded border">
            {filtered.map((c, i) => (
              <button
                key={i}
                className={`w-full text-left px-3 py-2 hover:bg-muted ${active === i ? "bg-muted" : ""}`}
                onClick={() => {
                  setActive(i);
                  setSelectedTopic("");
                  setCurrentQuestion("");
                  setAnswer("");
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded border p-4">
            <h2 className="text-xl font-semibold">{currentDomain}</h2>
            <div className="mt-2 text-sm text-muted-foreground">Key topics</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map((t) => (
                <a
                  key={t}
                  className={`rounded-full border px-2 py-0.5 text-xs hover:bg-muted ${selectedTopic === t ? "bg-muted" : ""}`}
                  href={googleLink(domainBase, t)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setSelectedTopic(t)}
                >
                  {t}
                </a>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Input
                placeholder={`Enter a ${domainBase} topic...`}
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              />
              <Button variant="outline" asChild>
                <a href={googleLink(domainBase, selectedTopic)} target="_blank" rel="noreferrer">
                  Search on Google
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded border p-4">
            <h3 className="font-medium">Topic Questions</h3>
            <div className="mt-2 grid md:grid-cols-2 gap-2 text-sm">
              {topicQuestions.map((q) => (
                <button
                  key={q}
                  className={`text-left rounded border px-2 py-2 hover:bg-muted ${currentQuestion === q ? "bg-muted" : ""}`}
                  onClick={() => {
                    setCurrentQuestion(q);
                    setAnswer("");
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {currentQuestion && (
              <div className="mt-4 rounded border p-3">
                <div className="font-medium">{currentQuestion}</div>
                <textarea
                  className="mt-3 w-full rounded border bg-background p-2 h-32"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {makeSubtopics(selectedTopic || domainBase).map((st) => (
                    <Button key={st} variant="outline" asChild>
                      <a href={googleLink(domainBase, st)} target="_blank" rel="noreferrer">
                        {st}
                      </a>
                    </Button>
                  ))}
                  <Button asChild>
                    <a href={googleLink(domainBase, selectedTopic || domainBase)} target="_blank" rel="noreferrer">
                      More resources
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded border p-4">
            <h3 className="font-medium">Study Materials</h3>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {[
                { title: `Top ${domainBase} interview questions`, url: googleLink(domainBase) },
                { title: `Important ${domainBase} topics`, url: googleLink(domainBase, "important topics") },
                { title: `${domainBase} roadmap`, url: googleLink(domainBase, "roadmap") },
              ].map((r) => (
                <li key={r.title}>
                  <a className="text-primary underline" href={r.url} target="_blank" rel="noreferrer">
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
