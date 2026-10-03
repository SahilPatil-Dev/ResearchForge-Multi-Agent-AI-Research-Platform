"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, LoaderCircle, Radio, WifiOff } from "lucide-react";

import { api } from "../../lib/api";
import type { Research, ResearchStatus as ResearchState } from "../../types";

interface Props {
  researchId: number;
  status: ResearchState;
  initialMessage: string | null;
}

export default function ResearchStatus({
  researchId,
  status,
  initialMessage,
}: Props) {
  const [lastEvent, setLastEvent] = useState<{
    researchId: number;
    message: string | null;
  } | null>(null);
  const [streamState, setStreamState] = useState<{
    researchId: number;
    isLive: boolean;
    error: string | null;
  }>({ researchId, isLive: false, error: null });
  const queryClient = useQueryClient();
  const currentStreamState =
    streamState.researchId === researchId
      ? streamState
      : { researchId, isLive: false, error: null };
  const message =
    currentStreamState.isLive && lastEvent?.researchId === researchId
      ? lastEvent.message
      : initialMessage;

  useEffect(() => {
    const controller = new AbortController();

    api.streamResearchEvents(
      researchId,
      controller.signal,
      (event) => {
        setStreamState({
          researchId,
          isLive: true,
          error: null,
        });
        setLastEvent({
          researchId,
          message: event.progress_message,
        });
        queryClient.setQueryData<Research>(
          ["research", researchId],
          (current) =>
            current
              ? {
                  ...current,
                  status: event.status,
                  progress_message: event.progress_message,
                }
              : current
        );
      }
    ).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setStreamState({
        researchId,
        isLive: false,
        error: error instanceof Error
          ? error.message
          : "Live updates are unavailable.",
      });
    });

    return () => controller.abort();
  }, [researchId, queryClient]);

  return (
    <section className="glass rounded-3xl p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
            <Activity size={19} />
          </div>
          <div>
            <h2 className="font-medium">Live research activity</h2>
            <p className="mt-1 text-xs text-white/40">
              Updates come directly from the research pipeline.
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
          {currentStreamState.isLive ? (
            <>
              <Radio size={12} className="text-emerald-300" />
              Live
            </>
          ) : currentStreamState.error ? (
            <>
              <WifiOff size={12} />
              Refreshing
            </>
          ) : (
            <>
              <LoaderCircle size={12} className="animate-spin" />
              Connecting
            </>
          )}
        </span>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="mt-5 flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            status === "failed"
              ? "bg-red-400"
              : status === "completed"
                ? "bg-emerald-400"
                : "bg-violet-300"
          } ${status === "pending" || status === "running" ? "animate-pulse" : ""}`}
        />
        <p className="text-sm leading-6 text-white/75">
          {message ?? "Waiting for a progress update from the server."}
        </p>
      </div>

      {currentStreamState.error && (
        <p className="mt-3 text-xs text-amber-200/70">
          {currentStreamState.error} The status will continue refreshing from the server.
        </p>
      )}
    </section>
  );
}
