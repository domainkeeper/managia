import { CalendarX } from "lucide-react";

export default function EmptyState({ title = "No events found", description = "Try adjusting your search or filters.", action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 px-4 text-center">
      <CalendarX className="mb-4 h-12 w-12 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
