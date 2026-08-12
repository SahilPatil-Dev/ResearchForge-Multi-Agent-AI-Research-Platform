import {
  ArrowLeft,
  Calendar,
  Copy,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useResearch,
  useDeleteResearch,
} from "../hooks/useResearch";

import StatusBadge from "../components/ui/StatusBadge";
import ResearchStatus from "../components/research/ResearchStatus";
import ReportView from "../components/research/ReportView";

export default function ResearchDetail() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const researchId =
    Number(id);

  const {
    data: research,
    isLoading,
    isError,
    error,
  } = useResearch(
    researchId
  );

  const deleteMutation =
    useDeleteResearch();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="glass h-12 w-32 animate-pulse rounded-2xl" />
        <div className="glass h-32 animate-pulse rounded-3xl" />
        <div className="glass h-[500px] animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (isError || !research) {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <h2 className="text-xl font-medium">
          Research not found
        </h2>

        <p className="mt-2 text-sm text-white/40">
          {error?.message}
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 text-sm text-black"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const deleteResearch =
    async () => {
      const confirmed =
        window.confirm(
          "Delete this research?"
        );

      if (!confirmed) return;

      await deleteMutation.mutateAsync(
        research.id
      );

      navigate("/history");
    };

  return (
    <div className="space-y-6">
      <Link
        to="/history"
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white"
      >
        <ArrowLeft size={16} />
        Research History
      </Link>

      <header className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <StatusBadge
            status={research.status}
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  research.report ?? ""
                )
              }
              className="rounded-xl bg-white/5 p-2.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <Copy size={16} />
            </button>

            <button
              onClick={deleteResearch}
              disabled={
                deleteMutation.isPending
              }
              className="rounded-xl bg-red-400/5 p-2.5 text-red-300/70 hover:bg-red-400/10 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h1 className="mt-5 max-w-4xl text-2xl font-semibold leading-tight sm:text-4xl">
          {research.topic}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/35">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />

            {new Date(
              research.created_at
            ).toLocaleString()}
          </span>

          {research.score !== null && (
            <span className="rounded-full bg-white/5 px-3 py-1.5">
              Quality {research.score}/10
            </span>
          )}
        </div>
      </header>

      {research.status !==
        "completed" &&
        research.status !==
          "failed" && (
          <ResearchStatus
            status={research.status}
          />
        )}

      {research.status ===
        "failed" && (
        <div className="rounded-3xl border border-red-400/10 bg-red-400/5 p-6">
          <h2 className="font-medium text-red-200">
            Research couldn't be completed
          </h2>

          <p className="mt-2 text-sm text-red-200/60">
            Something went wrong while
            generating this research.
          </p>

          {research.error_message && (
            <details className="mt-5">
              <summary className="cursor-pointer text-xs text-red-200/40">
                Technical details
              </summary>

              <pre className="mt-3 overflow-auto rounded-xl bg-black/20 p-4 text-xs text-red-200/50">
                {research.error_message}
              </pre>
            </details>
          )}
        </div>
      )}

      {research.status ===
        "completed" &&
        research.report && (
          <ReportView
            report={
              research.report
            }
          />
        )}

      {research.status ===
        "completed" &&
        research.feedback && (
          <section className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-medium">
              Research Quality
            </h2>

            {research.score !==
              null && (
              <div className="mt-5 text-4xl font-semibold">
                {research.score}
                <span className="text-lg text-white/30">
                  /10
                </span>
              </div>
            )}

            <pre className="mt-6 whitespace-pre-wrap text-sm leading-7 text-white/50">
              {research.feedback}
            </pre>
          </section>
        )}
    </div>
  );
}