import {
  Search,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useResearchHistory,
} from "../hooks/useResearch";

import ResearchCard from "../components/research/ResearchCard";

export default function History() {
  const [search, setSearch] =
    useState("");

  const {
    data,
    isLoading,
  } =
    useResearchHistory();

  const filtered =
    useMemo(() => {
      if (!data) return [];

      const query =
        search.toLowerCase().trim();

      if (!query) return data;

      return data.filter(
        (item) =>
          item.topic
            .toLowerCase()
            .includes(query)
      );
    }, [data, search]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">
          Research History
        </h1>

        <p className="mt-2 text-white/40">
          Explore your previous research.
        </p>
      </header>

      <div className="glass flex items-center gap-3 rounded-2xl px-4">
        <Search
          size={18}
          className="text-white/30"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search research..."
          className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-white/25"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="glass h-44 animate-pulse rounded-3xl"
              />
            )
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center text-white/40">
          No research found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(
            (item) => (
              <ResearchCard
                key={item.id}
                research={item}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}