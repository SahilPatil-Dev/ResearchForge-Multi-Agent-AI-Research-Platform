import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useResearchHistory,
} from "../hooks/useResearch";

import ResearchCard from "../components/research/ResearchCard";
import ResearchComposer from "../components/research/ResearchComposer";

export default function Dashboard() {
  const { user } =
    useAuth();

  const {
    data: research,
    isLoading,
  } =
    useResearchHistory();

  const recent =
    research?.slice(0, 6) ?? [];

  return (
    <div className="space-y-10">
      <header className="pt-4">
        <div className="mb-3 flex items-center gap-2 text-sm text-white/35">
          <Sparkles size={15} />
          AI Research Workspace
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Good evening,{" "}
          <span className="text-white/45">
            {user?.full_name
              ?.split(" ")[0]}
          </span>
        </h1>

        <p className="mt-3 max-w-xl text-white/40">
          Turn complex questions into
          structured, evidence-backed
          research.
        </p>
      </header>

      <ResearchComposer />

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">
              Recent Research
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Continue where you left off.
            </p>
          </div>

          <Link
            to="/history"
            className="flex items-center gap-1 text-sm text-white/45 hover:text-white"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="glass h-44 animate-pulse rounded-3xl"
                />
              )
            )}
          </div>
        ) : recent.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <div className="text-lg font-medium">
              No research yet
            </div>

            <p className="mx-auto mt-2 max-w-md text-sm text-white/35">
              Start with a difficult question.
              ResearchForge will turn it into
              structured research.
            </p>

            <Link
              to="/research/new"
              className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black"
            >
              Start Research
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recent.map(
              (item) => (
                <ResearchCard
                  key={item.id}
                  research={item}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}