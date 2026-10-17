"use client";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import type { AgentState, AgentStatus } from "@/lib/types";

export interface Stage {
  key: string;
  label: string;
}

export const STAGES: Stage[] = [
  { key: "researcher", label: "Research" },
  { key: "director", label: "Script" },
  { key: "voice", label: "Review" },
  { key: "footage", label: "Assets" },
  { key: "visual", label: "Edit" },
  { key: "editor", label: "Mix" },
  { key: "publish", label: "Publish" },
];

function stageStatus(
  key: string, agents: Record<string, AgentState>, jobStatus: string | null, running: boolean,
): AgentStatus {
  if (key === "publish") {
    if (jobStatus === "done") return "done";
    if (jobStatus === "error") return "error";
    if (running && agents.editor?.status === "done") return "working";
    return "idle";
  }
  const a = agents[key];
  if (!a) return "idle";
  return a.status;
}

const NODE: Record<AgentStatus, string> = {
  idle: "border-white/15 bg-studio-card text-white/30",
  working: "border-studio-gold bg-studio-gold/15 text-studio-gold shadow-glow",
  done: "border-studio-gold bg-gradient-to-br from-studio-gold to-orange-500 text-black",
  error: "border-red-500 bg-red-500/15 text-red-400",
};

export default function Pipeline({
  agents, jobStatus, running, title, elapsed,
}: {
  agents: Record<string, AgentState>;
  jobStatus: string | null;
  running: boolean;
  title: string | null;
  elapsed: string | null;
}) {
  const doneCount = STAGES.filter((s) => stageStatus(s.key, agents, jobStatus, running) === "done").length;
  const pct = Math.round((doneCount / STAGES.length) * 100);

  return (
    <section className="rounded-2xl border border-white/5 bg-studio-panel p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-extrabold text-white">
            {title || "No active production"}
          </div>
          <div className="text-[11px] text-white/35">
            {running ? "AI agents are producing your video…" : "Configure a video below and hit Generate"}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4 text-right">
          <div>
            <div className="font-mono text-sm font-bold text-studio-gold">{doneCount}/{STAGES.length}</div>
            <div className="text-[10px] text-white/35">Stages done</div>
          </div>
          <div>
            <div className="font-mono text-sm font-bold text-studio-gold">{pct}%</div>
            <div className="text-[10px] text-white/35">Completed</div>
          </div>
          <div>
            <div className="font-mono text-sm font-bold text-white/70">{elapsed || "—"}</div>
            <div className="text-[10px] text-white/35">Total time</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-5 h-[3px] rounded-full bg-white/8" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div
          className="absolute left-0 top-5 h-[3px] rounded-full bg-gradient-to-r from-studio-gold to-orange-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
        <div className="relative grid grid-cols-7">
          {STAGES.map((s, i) => {
            const st = stageStatus(s.key, agents, jobStatus, running);
            return (
              <div key={s.key} className="flex flex-col items-center gap-2">
                <motion.div
                  animate={st === "working" ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={st === "working" ? { repeat: Infinity, duration: 1.4 } : {}}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-[13px] font-extrabold ${NODE[st]}`}
                >
                  {st === "done" ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </motion.div>
                <div className={`text-[10px] font-semibold sm:text-[11px] ${st === "idle" ? "text-white/30" : st === "done" ? "text-studio-gold" : "text-white/80"}`}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
