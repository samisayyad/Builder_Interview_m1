import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo, useState } from "react";

const slides = [
  {
    title: "Master Interviews with Real-time AI Coaching",
    desc: "Live body language, speech, and emotion analysis with instant feedback.",
  },
  {
    title: "Practice Across 15+ Domains",
    desc: "Technical, behavioral, HR, and case studies with adaptive difficulty.",
  },
];

export default function Hero() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  useEffect(() => {
    if (!embla) return;
    const id = setInterval(() => embla.scrollNext(), 3500);
    return () => clearInterval(id);
  }, [embla]);

 
  // useEffect(() => {
  //   let u = 0,
  //     s = 0,
  //     c = 0;
  //   const id = setInterval(() => {
  //     u = Math.min(25000, u + 500);
  //     s = Math.min(1200000, s + 30000);
  //     c = Math.min(23, c + 1);
  //     setUsers(u);
  //     setSessions(s);
  //     setScore(c);
  //   }, 50);
  //   return () => clearInterval(id);
  // }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--gradient-from))_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,hsl(var(--gradient-to))_0%,transparent_50%)] opacity-20" />
      <div className="container py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((s, i) => (
                <div key={i} className="min-w-0 shrink-0 basis-full pr-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-bold leading-tight"
                  >
                    {s.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-4 text-lg text-muted-foreground"
                  >
                    {s.desc}
                  </motion.p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => embla?.scrollPrev()}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => embla?.scrollNext()}
            >
              Next
            </Button>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="https://devgent-ai.vercel.app/">
              <Button
                size="lg"
                className="h-12 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white"
              >
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="h-12 px-6">
                View Dashboard
              </Button>
            </Link>
          </div>
          {/* <div className="mt-8 grid grid-cols-3 gap-6 text-center">
            <Stat
              label="Active Users"
              value={users.toLocaleString()}
              suffix="+"
            />
            <Stat
              label="Sessions"
              value={Math.floor(sessions / 1000).toLocaleString()}
              suffix="k+"
            />
            <Stat label="Avg. Score↑" value={score.toString()} suffix="%" />
          </div> */}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="aspect-video rounded-xl border bg-card shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20" />
            <div className="p-6">
              <h3 className="font-semibold">Live AI Analysis</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Posture" value="92%" color="text-emerald-500" />
                <Metric label="Eye Contact" value="87%" color="text-blue-500" />
                <Metric label="Clarity" value="90%" color="text-indigo-500" />
                <Metric
                  label="Confidence"
                  value="88%"
                  color="text-purple-500"
                />
              </div>
              <div className="mt-6 h-40 rounded-lg bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 border" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  const out = useMemo(() => `${value}${suffix ?? ""}`, [value, suffix]);
  return (
    <div>
      <div className="text-2xl font-bold">{out}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={"font-semibold " + color}>{value}</span>
    </div>
  );
}
