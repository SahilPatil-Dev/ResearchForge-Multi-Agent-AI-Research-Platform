import {
  ArrowUp,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  useCreateResearch,
} from "../../hooks/useResearch";

import GlassCard from "../ui/GlassCard";

export default function ResearchComposer() {
  const [topic, setTopic] =
    useState("");

  const navigate =
    useNavigate();

  const createResearch =
    useCreateResearch();

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!topic.trim()) return;

    try {
      const research =
        await createResearch.mutateAsync(
          {
            topic: topic.trim(),
          }
        );

      navigate(
        `/research/${research.id}`
      );
    } catch {
      // Error is available through mutation state.
    }
  };

  return (
    <GlassCard className="relative overflow-hidden p-1">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <form
        onSubmit={submit}
        className="relative"
      >
        <div className="flex items-center gap-2 px-5 pt-5 text-sm text-white/40">
          <Sparkles size={16} />
          AI Research
        </div>

        <textarea
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          placeholder="What do you want to understand?"
          rows={4}
          className="w-full resize-none bg-transparent px-5 py-5 text-lg text-white outline-none placeholder:text-white/25"
        />

        <div className="flex items-center justify-between border-t border-white/10 p-3">
          <div className="hidden text-xs text-white/30 sm:block">
            Ask a complex question and
            ResearchForge will investigate it.
          </div>

          <button
            type="submit"
            disabled={
              !topic.trim() ||
              createResearch.isPending
            }
            className="ml-auto flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-40"
          >
            {createResearch.isPending
              ? "Starting..."
              : "Start Research"}

            {!createResearch.isPending && (
              <ArrowUp size={16} />
            )}
          </button>
        </div>
      </form>

      {createResearch.isError && (
        <div className="px-5 pb-4 text-sm text-red-300">
          {createResearch.error.message}
        </div>
      )}
    </GlassCard>
  );
}