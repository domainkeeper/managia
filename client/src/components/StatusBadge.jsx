import { cn } from "../utils/helpers.js";

const STATUS_MAP = {
  completed: { bg: "bg-gray-100", text: "text-gray-700", label: "Completed" },
  "registration-closed": { bg: "bg-amber-100", text: "text-amber-700", label: "Reg. Closed" },
  "registration-open": { bg: "bg-emerald-100", text: "text-emerald-700", label: "Reg. Open" },
  upcoming: { bg: "bg-blue-100", text: "text-blue-700", label: "Happening Soon" },
};

export default function StatusBadge({ event, className }) {
  const s = STATUS_MAP[event.status] || STATUS_MAP.completed;
  return (
    <span className={cn("badge", s.bg, s.text, className)}>
      {s.label}
    </span>
  );
}
