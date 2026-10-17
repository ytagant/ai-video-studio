"use client";
import { useState } from "react";
import {
  Activity, Clapperboard, Download, FolderDown, HelpCircle, LayoutGrid, Settings, Video,
} from "lucide-react";
import { downloadUrl } from "@/lib/api";

export interface HistoryEntry {
  id: string;
  title: string;
}

const CONNECTIONS: { name: string; state: "connected" | "missing" | "optional" | "none" }[] = [
  { name: "Gemini", state: "connected" },
  { name: "Pixabay", state: "connected" },
  { name: "ElevenLabs", state: "connected" },
  { name: "Pexels", state: "missing" },
  { name: "Unsplash", state: "optional" },
  { name: "Claude", state: "optional" },
  { name: "Music", state: "none" },
];

const STATE_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  connected: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Connected" },
  missing: { dot: "bg-amber-400", text: "text-amber-400", label: "Missing" },
  optional: { dot: "bg-white/25", text: "text-white/40", label: "Optional" },
  none: { dot: "bg-white/15", text: "text-white/30", label: "None" },
};

function SoonTip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-studio-card border border-white/15 px-2.5 py-1 text-[11px] text-white/70 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
      {children}
    </span>
  );
}

function NavItem({
  icon: Icon, label, active, soon,
}: {
  icon: any; label: string; active?: boolean; soon?: boolean;
}) {
  return (
    <button
      className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition
        ${active
          ? "bg-gradient-to-r from-studio-gold to-amber-500 text-black shadow-glow"
          : "text-white/55 hover:bg-white/5 hover:text-white"}`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="truncate">{label}</span>
      {soon && <SoonTip>Coming soon</SoonTip>}
    </button>
  );
}

export default function Sidebar({ history }: { history: HistoryEntry[] }) {
  const [showOutput, setShowOutput] = useState(true);
  const connectedCount = CONNECTIONS.filter((c) => c.state === "connected").length;

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 overflow-y-auto border-r border-white/5 bg-studio-deep px-4 py-5 lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-studio-gold to-orange-600 text-xl font-black text-black shadow-glow">
          V
        </div>
        <div>
          <div className="text-[17px] font-extrabold leading-tight text-white">Video Studio</div>
          <div className="text-[11px] text-white/40">From idea to viral video</div>
        </div>
      </div>

      {/* CREATE */}
      <div>
        <div className="mb-2 px-2 text-[10px] font-bold tracking-[0.14em] text-white/30">CREATE</div>
        <div className="space-y-1">
          <NavItem icon={LayoutGrid} label="Studio" active />
          <NavItem icon={Video} label="Projects" soon />
        </div>
      </div>

      {/* TOOLS */}
      <div>
        <div className="mb-2 px-2 text-[10px] font-bold tracking-[0.14em] text-white/30">TOOLS</div>
        <div className="space-y-1">
          <NavItem icon={Activity} label="Activity" soon />
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/5 hover:text-white"
          >
            <FolderDown className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">Output Folder</span>
            {history.length > 0 && (
              <span className="ml-auto rounded-full bg-studio-gold/15 px-2 py-0.5 text-[10px] font-bold text-studio-gold">
                {history.length}
              </span>
            )}
          </button>
          {showOutput && (
            <div className="ml-4 space-y-1 border-l border-white/10 pl-3 pt-1">
              {history.length === 0 && (
                <div className="px-2 py-1 text-[11px] text-white/30">No videos yet</div>
              )}
              {history.slice(0, 6).map((h) => (
                <a
                  key={h.id}
                  href={downloadUrl(h.id)}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-white/55 transition hover:bg-white/5 hover:text-white"
                  title={h.title}
                >
                  <Download className="h-3 w-3 shrink-0 text-studio-gold/70" />
                  <span className="truncate">{h.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ACCOUNT */}
      <div>
        <div className="mb-2 px-2 text-[10px] font-bold tracking-[0.14em] text-white/30">ACCOUNT</div>
        <div className="space-y-1">
          <NavItem icon={Settings} label="Settings" soon />
          <NavItem icon={HelpCircle} label="Help & Support" soon />
        </div>
      </div>

      {/* CONNECTIONS */}
      <div>
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-[10px] font-bold tracking-[0.14em] text-white/30">CONNECTIONS</span>
          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            {connectedCount} connected
          </span>
        </div>
        <div className="space-y-0.5">
          {CONNECTIONS.map((c) => {
            const s = STATE_STYLE[c.state];
            return (
              <div
                key={c.name}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] transition hover:bg-white/5"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                <span className="text-white/65">{c.name}</span>
                <span className={`ml-auto text-[11px] ${s.text}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 px-2 pt-2">
        <Clapperboard className="h-4 w-4 text-studio-gold/60" />
        <span className="text-[10px] text-white/25">Video Studio · self-hosted · FFmpeg</span>
      </div>
    </aside>
  );
}
