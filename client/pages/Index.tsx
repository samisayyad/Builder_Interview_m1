import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Domains from "@/components/home/Domains";
import Testimonials from "@/components/home/Testimonials";

export default function Index() {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <Domains />
      <Testimonials />
    </MainLayout>
  );
}
