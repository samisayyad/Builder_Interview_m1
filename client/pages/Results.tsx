import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Results() {
  const { sessions } = useAuth();
  return (
    <MainLayout>
      <section className="container py-10 space-y-4">
        <h1 className="text-3xl font-bold">Results & Performance</h1>
        {!sessions.length && (
          <p className="text-sm text-muted-foreground">
            No results yet. Start an interview to see results here.
          </p>
        )}
        <div className="grid gap-4">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>
                  {new Date(s.startedAt).toLocaleString()} ·{" "}
                  {s.domain || "General"} · Score {s.overallScore}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium">Transcript</h4>
                    <div className="mt-2 max-h-48 overflow-auto rounded border p-2 whitespace-pre-wrap">
                      {s.transcript || "—"}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Question Feedback</h4>
                    <ul className="mt-2 space-y-2">
                      {(s.questions || []).map((q, i) => (
                        <li key={i} className="rounded border p-2">
                          <div className="font-medium">
                            Q{i + 1}: {q.question}
                          </div>
                          <div className="text-muted-foreground">
                            Score {q.score} · {q.feedback}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
