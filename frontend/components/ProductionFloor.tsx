"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { AGENT_DEFS, AgentState } from "@/lib/types";
import RobotAvatar from "@/components/RobotAvatar";

const STATUS_DOT: Record<string, string> = {
  idle: "bg-white/20",
  working: "bg-studio-gold",
  done: "bg-emerald-400",
  error: "bg-red-400",
};

export default function ProductionFloor({ agents }: { agents: Record<string, AgentState> }) {
  const workingCount = AGENT_DEFS.filter((a) => agents[a.id]?.status === "working").length;
  const doneCount = AGENT_DEFS.filter((a) => agents[a.id]?.status === "done").length;

  return (
    <section className="rounded-2xl border border-white/5 bg-studio-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-white">
          Production floor{" "}
          <span className="ml-1 text-[11px] font-normal text-white/35">
            {workingCount > 0
              ? `${workingCount} working · ${doneCount} done`
              : doneCount === AGENT_DEFS.length
                ? "all done"
                : doneCount > 0
                  ? `${doneCount} done`
                  : "standing by"}
          </span>
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-white/30">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-studio-gold" /> Working</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Done</span>
        </div>
      </div>

      {/* robot avatars */}
      <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {AGENT_DEFS.map((def) => {
          const st = agents[def.id] ?? { status: "idle", progress: 0, message: "" };
          return (
            <div
              key={def.id}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition
                ${st.status === "working"
                  ? "border-studio-gold/50 bg-studio-gold/5"
                  : st.status === "done"
                    ? "border-emerald-400/25 bg-emerald-400/5"
                    : "border-white/8 bg-studio-card"}`}
            >
              <RobotAvatar status={st.status} size={52} />
              <div className="text-center text-[10px] font-bold leading-tight text-white/75">
                {def.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* status rows */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {AGENT_DEFS.map((def) => {
          const st = agents[def.id] ?? { status: "idle", progress: 0, message: "Waiting…" };
          const working = st.status === "working";
          return (
            <div
              key={def.id}
              className={`rounded-xl border bg-studio-card px-3.5 py-2.5 transition ${
                working ? "border-studio-gold/40" : "border-white/8"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[st.status]}`} />
                <span className="truncate text-[12px] font-bold text-white/85">{def.label}</span>
                {working && <Loader2 className="ml-auto h-3.5 w-3.5 shrink-0 animate-spin text-studio-gold" />}
                {st.status === "done" && <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                {st.status === "error" && <XCircle className="ml-auto h-3.5 w-3.5 shrink-0 text-red-400" />}
              </div>
              <div className="mt-1.5 truncate text-[11px] text-white/40">{st.message}</div>
              <div className="mt-1.5 h-1 rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${st.status === "done" ? "bg-emerald-400" : "bg-studio-gold"}`}
                  animate={{ width: `${st.progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
