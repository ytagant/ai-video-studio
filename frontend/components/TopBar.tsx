"use client";
import { Search } from "lucide-react";

export default function TopBar({
  running, agentsDone, progress, jobId,
}: {
  running: boolean;
  agentsDone: number;
  progress: number;
  jobId: string | null;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/5 bg-studio-deep/60 px-4 py-3 lg:px-6">
      {/* mobile brand */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-studio-gold to-orange-600 text-base font-black text-black">
          V
        </div>
        <span className="text-sm font-extrabold text-white">Video Studio</span>
      </div>

      {/* search */}
      <div className="relative mx-auto w-full max-w-xl">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          placeholder="Search your videos and projects..."
          className="w-full rounded-xl border border-white/10 bg-studio-input py-2.5 pl-10 pr-4 text-sm text-white/80 placeholder:text-white/25 outline-none transition focus:border-studio-gold/50"
        />
      </div>

      {/* status pills */}
      <div className="ml-auto hidden items-center gap-2 sm:flex">
        <span
          className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${
            running
              ? "border-studio-gold/40 bg-studio-gold/10 text-studio-gold"
              : "border-white/10 bg-white/5 text-white/40"
          }`}
        >
          {running ? "● In production" : "○ Idle"}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/50">
          {agentsDone}/6 agents
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-semibold text-white/50">
          {Math.round(progress)}%
        </span>
        {jobId && (
          <span className="hidden font-mono text-[10px] text-white/25 xl:block">
            {jobId.slice(0, 8)}
          </span>
        )}
      </div>
    </div>
  );
}
