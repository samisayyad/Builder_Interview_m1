import { Progress } from "@/components/ui/progress";

export default function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const color =
    value > 70
      ? "text-emerald-600"
      : value > 40
        ? "text-amber-600"
        : "text-red-600";
  return (
    <div className="rounded-md border p-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-medium ${color}`}>{value}%</span>
      </div>
      <div className="mt-1">
        <Progress value={Math.max(0, Math.min(100, value))} />
      </div>
    </div>
  );
}
