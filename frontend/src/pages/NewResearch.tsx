import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowUp,
  Sparkles,
} from "lucide-react";

import {
  useCreateResearch,
} from "../hooks/useResearch";

export default function NewResearch() {
  const [topic, setTopic] =
    useState("");

  const navigate =
    useNavigate();

  const mutation =
    useCreateResearch();

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!topic.trim()) return;

    try {
      const research =
        await mutation.mutateAsync({
          topic: topic.trim(),
        });

      navigate(
        `/research/${research.id}`
      );
    } catch {}
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center">
      <div className="w-full">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
              <Sparkles size={20} />
            </div>
          </div>

          <h1 className="text-3xl font-semibold sm:text-5xl">
            What would you like
            <br />
            to understand?
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-white/40">
            Ask a complex question and
            ResearchForge will search, analyze,
            synthesize and critique the research.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="glass rounded-3xl p-2"
        >
          <textarea
            value={topic}
            onChange={(e) =>
              setTopic(e.target.value)
            }
            autoFocus
            rows={7}
            placeholder="Example: What is the impact of AI regulation on Indian software companies?"
            className="w-full resize-none bg-transparent p-5 text-lg outline-none placeholder:text-white/20"
          />

          {mutation.isError && (
            <div className="px-5 pb-3 text-sm text-red-300">
              {mutation.error.message}
            </div>
          )}

          <div className="flex justify-end border-t border-white/10 p-3">
            <button
              disabled={
                !topic.trim() ||
                mutation.isPending
              }
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-40"
            >
              {mutation.isPending
                ? "Starting..."
                : "Start Research"}

              <ArrowUp size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}