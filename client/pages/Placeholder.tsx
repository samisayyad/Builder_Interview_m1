import MainLayout from "@/components/layout/MainLayout";

export default function Placeholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <MainLayout>
      <section className="container py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">
            {description ??
              "This page is ready to be built next. Tell me what sections and content you want here, and I'll implement it with the same design system."}
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
