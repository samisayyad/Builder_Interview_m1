import { motion } from "framer-motion";
import { Zap, Activity, Camera, Mic2, Gauge, Sparkles } from "lucide-react";

const items = [
  {
    icon: Camera,
    title: "Body Language AI",
    desc: "Pose, eye contact, gestures, and engagement tracking in real time.",
  },
  {
    icon: Mic2,
    title: "Speech Analysis",
    desc: "Clarity, pace, volume, filler words, and confidence indicators.",
  },
  {
    icon: Activity,
    title: "Live AI Assistant",
    desc: "AI helps to reach you.",
  },
  {
    icon: Gauge,
    title: "Performance Insights",
    desc: "Interactive charts, strengths/weaknesses, and progress trends.",
  },
  {
    icon: Zap,
    title: "MCQ Practice",
    desc: "1000+ questions across 15+ domains with explanations and modes.",
  },
  {
    icon: Sparkles,
    title: "Personal Dashboard",
    desc: "Review you analytics and performance.",
  },
];

export default function Features() {
  return (
    <section id="features" className="container py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">
          Everything you need to ace interviews
        </h2>
        <p className="mt-3 text-muted-foreground">
          Practice technical, behavioral, HR, and case study interviews with AI
          that coaches you in real time.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <it.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold text-lg">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
