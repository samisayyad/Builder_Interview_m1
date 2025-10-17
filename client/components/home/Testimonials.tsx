import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

const testimonials = [
  {
    name: "Rayan Nadeem.",
    role: "Data Scientist @ Stripe",
    quote:
      "The real-time feedback on my eye contact and speaking pace was game-changing. Landed my dream job!",
  },
  {
    name: "Suhas MS.",
    role: "Frontend Engineer @ Shopify",
    quote:
      "Love the MCQ system and the analytics dashboard. I improved 18% in two weeks.",
  },
  {
    name: "Sanjana B.",
    role: "PM @ Atlassian",
    quote:
      "The behavioral interview coaching with STAR guidance is the best I've seen.",
  },
];

export default function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  useEffect(() => {
    if (!embla) return;
    const id = setInterval(() => embla.scrollNext(), 3000);
    return () => clearInterval(id);
  }, [embla]);

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">
          Loved by candidates worldwide
        </h2>
        <p className="mt-3 text-muted-foreground">
          Thousands of professionals use InterviewAce Pro to gain confidence and
          ace their interviews.
        </p>
      </div>
      <div className="mt-10 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="min-w-0 shrink-0 basis-full md:basis-1/2 lg:basis-1/3 rounded-xl border bg-card p-6 shadow-sm"
            >
              <blockquote className="text-lg">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t.name}</span> ·{" "}
                {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
