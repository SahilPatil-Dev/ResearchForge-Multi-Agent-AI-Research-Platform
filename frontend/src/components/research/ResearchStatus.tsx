import {
  Check,
  Circle,
  LoaderCircle,
  X,
} from "lucide-react";

import type {
  ResearchStatus,
} from "../../types";

interface Props {
  status: ResearchStatus;
}

const stages = [
  "Search",
  "Read",
  "Write",
  "Critique",
  "Revision",
];

export default function ResearchStatus({
  status,
}: Props) {
  const completed =
    status === "completed";

  const failed =
    status === "failed";

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-6">
        <h3 className="font-medium">
          Research Pipeline
        </h3>

        <p className="mt-1 text-sm text-white/35">
          ResearchForge is processing your
          question.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {stages.map(
          (stage, index) => {
            const active =
              status === "running" &&
              index === 0;

            const done =
              completed ||
              (status === "running" &&
                index === 0);

            return (
              <div
                key={stage}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  {failed &&
                  index === 0 ? (
                    <X
                      size={16}
                      className="text-red-300"
                    />
                  ) : done ? (
                    <Check
                      size={16}
                      className="text-emerald-300"
                    />
                  ) : active ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin text-blue-300"
                    />
                  ) : (
                    <Circle
                      size={12}
                      className="text-white/20"
                    />
                  )}
                </div>

                <span className="text-xs text-white/40">
                  {stage}
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}