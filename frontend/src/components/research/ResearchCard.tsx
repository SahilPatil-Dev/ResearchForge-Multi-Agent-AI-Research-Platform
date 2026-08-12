import {
  ArrowUpRight,
  Clock,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import type {
  Research,
} from "../../types";

import GlassCard from "../ui/GlassCard";
import StatusBadge from "../ui/StatusBadge";

interface Props {
  research: Research;
}

export default function ResearchCard({
  research,
}: Props) {
  return (
    <Link
      to={`/research/${research.id}`}
    >
      <GlassCard className="glass-hover group h-full p-5">
        <div className="mb-5 flex items-center justify-between">
          <StatusBadge
            status={research.status}
          />

          <ArrowUpRight
            size={17}
            className="text-white/25 transition group-hover:text-white"
          />
        </div>

        <h3 className="line-clamp-2 min-h-14 text-base font-medium leading-7">
          {research.topic}
        </h3>

        <div className="mt-5 flex items-center justify-between text-xs text-white/35">
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            {new Date(
              research.created_at
            ).toLocaleDateString()}
          </div>

          {research.score !== null && (
            <span>
              {research.score}/10
            </span>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}