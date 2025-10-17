import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"];

export default function Dashboard() {
  const { sessions } = useAuth();
  const total = sessions.length;
  const avg = total
    ? Math.round(sessions.reduce((a, s) => a + s.overallScore, 0) / total)
    : 0;
  const timeSpent = sessions.reduce((a, s) => a + s.durationSec, 0);
  const accuracy = total
    ? Math.round(sessions.reduce((a, s) => a + s.speech.clarity, 0) / total)
    : 0;
  const points = sessions.reduce((a, s) => a + s.overallScore, 0);
  const progress = Array.from({ length: 7 }).map((_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    score: sessions[i]?.overallScore ?? 0,
  }));
  const radar = [
    { skill: "Communication", A: accuracy },
    {
      skill: "Confidence",
      A: total
        ? Math.round(
            sessions.reduce((a, s) => a + s.speech.confidence, 0) / total,
          )
        : 0,
    },
    {
      skill: "Pace",
      A: total
        ? Math.min(
            100,
            Math.round(
              sessions.reduce(
                (a, s) =>
                  a + Math.max(0, 100 - Math.abs(150 - s.speech.paceWpm)),
              ),
              0,
            ) / Math.max(total, 1),
          )
        : 0,
    },
    {
      skill: "Posture",
      A: total
        ? Math.round(sessions.reduce((a, s) => a + s.body.posture, 0) / total)
        : 0,
    },
    {
      skill: "Stability",
      A: total
        ? Math.round(
            sessions.reduce((a, s) => a + s.body.headStability, 0) / total,
          )
        : 0,
    },
  ];
  const activity = [
    { name: "Interviews", value: total },
    { name: "MCQs", value: 0 },
    { name: "Analytics", value: total ? 5 : 0 },
    { name: "Review", value: total ? 3 : 0 },
  ];
  const domainPerf = [
    { domain: "General", accuracy: avg },
    {
      domain: "Body",
      accuracy: total
        ? Math.round(
            sessions.reduce((a, s) => a + s.body.engagement, 0) / total,
          )
        : 0,
    },
    { domain: "Speech", accuracy: accuracy },
  ];

  return (
    <MainLayout>
      <section className="container py-10 space-y-6">
        <div className="grid gap-6 md:grid-cols-6">
          <Stat title="Total Sessions" value={total.toString()} />
          <Stat title="Average Score" value={`${avg}%`} />
          <Stat
            title="Time Spent"
            value={`${Math.round(timeSpent / 60)} min`}
          />
          <Stat title="Current Streak" value={`${total ? 1 : 0} days`} />
          <Stat title="Accuracy" value={`${accuracy}%`} />
          <Stat title="Points" value={points.toString()} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progress}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Skill Assessment</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    dataKey="A"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Domain-wise Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainPerf}>
                  <XAxis dataKey="domain" stroke="#94a3b8" />
                  <YAxis hide />
                  <Tooltip />
                  <Bar
                    dataKey="accuracy"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activity}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {activity.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              <Link to="/interview">
                <Button>Start new interview</Button>
              </Link>
              <Button variant="outline" disabled>
                Continue MCQs
              </Button>
              <Button variant="outline" disabled>
                View analytics
              </Button>
              <Button variant="outline" disabled>
                Profile settings
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {!total && (
                <div className="text-sm text-muted-foreground">
                  No sessions yet. Start your first interview.
                </div>
              )}
              {sessions.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between border-b py-2 text-sm"
                >
                  <div>{new Date(s.startedAt).toLocaleString()}</div>
                  <div className="text-muted-foreground">{s.durationSec}s</div>
                  <div className="font-medium">{s.overallScore}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
