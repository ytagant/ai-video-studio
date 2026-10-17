"use client";
import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import CategorySelector from "@/components/CategorySelector";
import ProductionFloor from "@/components/ProductionFloor";
import Storyboard from "@/components/Storyboard";
import { AGENT_DEFS, AgentState, JobMeta, Scene, idleAgents } from "@/lib/types";
import { JobParams, createJob, getJob } from "@/lib/api";

export default function Home() {
  const [agents, setAgents] = useState<Record<string, AgentState>>(idleAgents());
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [meta, setMeta] = useState<JobMeta | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("Documentary");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  async function start(params: JobParams) {
    setError(null); setScenes([]); setMeta(null);
    setVideoReady(false); setAgents(idleAgents());
    try {
      const { job_id } = await createJob(params);
      setJobId(job_id); setRunning(true);
      // HTTP polling for progress (some free hosts block WebSockets).
      if (pollRef.current) clearInterval(pollRef.current);
      const applySnapshot = (job: any) => {
        if (job.agents) {
          setAgents((prev) => {
            const next = { ...prev };
            for (const [id, a] of Object.entries<any>(job.agents))
              next[id] = { ...next[id], status: a.status, progress: a.progress, message: a.message };
            return next;
          });
        }
        if (Array.isArray(job.scenes) && job.scenes.length) setScenes(job.scenes);
        if (job.metadata && job.metadata.title) setMeta(job.metadata);
      };
      const stop = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
      pollRef.current = setInterval(async () => {
        try {
          const job = await getJob(job_id);
          applySnapshot(job);
          if (job.status === "done") { stop(); setRunning(false); setVideoReady(true); }
          else if (job.status === "error") { stop(); setRunning(false); setError(job.error || "Production failed"); }
        } catch {
          // transient network hiccup — keep polling
        }
      }, 2500);
    } catch (e: any) {
      setError("Could not start job: " + (e?.message || e));
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar running={running} onStart={(p) => start({ ...p, category })} />
      <main className="flex-1 p-4 lg:p-6 space-y-5 max-w-6xl w-full mx-auto">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Autonomous Production Floor</h1>
            <p className="text-xs text-white/40">Six AI agents collaborate live to produce your video</p>
          </div>
          <div className="text-[11px] text-white/30 font-mono hidden sm:block">
            {jobId ? `job ${jobId}` : "no active job"}
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <CategorySelector selected={category} onSelect={setCategory} />
        <ProductionFloor agents={agents} />
        <Storyboard jobId={jobId} scenes={scenes} meta={meta} videoReady={videoReady} />

        <footer className="text-center text-[11px] text-white/25 pb-6">
          AI Video Studio · self-hosted · FFmpeg engine · {AGENT_DEFS.length} agents
        </footer>
      </main>
    </div>
  );
}
