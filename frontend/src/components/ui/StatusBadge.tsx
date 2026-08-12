import type {
  ResearchStatus,
} from "../../types";

interface Props {
  status: ResearchStatus;
}

export default function StatusBadge({
  status,
}: Props) {
  const config = {
    pending: {
      label: "Pending",
      className:
        "bg-white/5 text-white/50",
    },

    running: {
      label: "Researching",
      className:
        "bg-blue-400/10 text-blue-300",
    },

    completed: {
      label: "Completed",
      className:
        "bg-emerald-400/10 text-emerald-300",
    },

    failed: {
      label: "Failed",
      className:
        "bg-red-400/10 text-red-300",
    },
  };

  const item =
    config[status];

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs ${item.className}`}
    >
      {item.label}
    </span>
  );
}