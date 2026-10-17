"use client";
import { useState } from "react";
import { CheckCircle2, Clapperboard, Loader2, Mic } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import type { JobParams } from "@/lib/api";

export const STYLES = ["Cinematic explainer documentary", "3D Recreation", "Anime saga"];
const LANGUAGES = ["English", "Urdu", "Hindi"];
const ELEVEN_VOICE: Record<string, string> = {
  English: "Rachel · American · warm studio",
  Urdu: "Adam · deep · clear",
  Hindi: "Elli · bright · expressive",
};

const field =
  "w-full rounded-xl bg-studio-input border border-white/10 px-3.5 py-2.5 text-sm text-white/85 placeholder:text-white/25 outline-none focus:border-studio-gold/60 transition";

export default function NewVideoCard({
  running,
  onStart,
  onCategoryChange,
  style,
}: {
  running: boolean;
  onStart: (p: JobParams) => void;
  onCategoryChange: (c: string) => void;
  style: string;
}) {
  const [topic, setTopic] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [category, setCategory] = useState("Documentary");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState(60);

  const submit = () => {
    if (!topic.trim() || running) return;
    const fullTopic = keyPoints.trim()
      ? `${topic.trim()}\n\nKey points to cover: ${keyPoints.trim()}`
      : topic.trim();
    onStart({
      topic: fullTopic,
      duration,
      language,
      style,
      category,
      voice: "default",
    });
  };

  const fill = ((duration - 15) / (600 - 15)) * 100;
  const durLabel =
    duration >= 60
      ? `${Math.floor(duration / 60)} min${duration % 60 ? ` ${duration % 60}s` : ""}`
      : `${duration}s`;

  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/5 bg-studio-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-white">New video</h2>
        <span className="text-[11px] text-white/30">Brief</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-white/50">Video title / topic</label>
          <input
            className={field}
            placeholder="e.g. The final hours of Apollo 13 — minute by minute"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/50">
            Key points & notes <span className="text-white/25">optional</span>
          </label>
          <textarea
            className={`${field} min-h-[76px] resize-y`}
            placeholder="Facts to include, angle, things to avoid…"
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
          />
          <div className="mt-1 text-[10px] text-white/25">The script writer follows these.</div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/50">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => {
              const active = c.id === category;
              return (
                <button
                  key={c.id}
                  onClick={() => { setCategory(c.id); onCategoryChange(c.id); }}
                  className={`relative overflow-hidden rounded-xl border-2 text-left transition
                    ${active ? "border-studio-gold shadow-glow" : "border-white/10 hover:border-white/25"}`}
                >
                  <img src={c.image} alt={c.label} className="h-12 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  {active && <CheckCircle2 className="absolute right-1.5 top-1.5 h-4 w-4 text-studio-gold" />}
                  <div className={`absolute bottom-1 left-2 text-[11px] font-bold ${active ? "text-studio-gold" : "text-white"}`}>
                    {c.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Language</label>
            <select className={field} value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1 text-xs text-white/50">
              <Mic className="h-3 w-3" /> Voice
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-studio-gold/25 bg-studio-gold/5 px-3.5 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-studio-gold/20 text-[11px]">🎙</span>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-bold text-studio-gold">ElevenLabs studio</div>
                <div className="truncate text-[10px] text-white/40">{ELEVEN_VOICE[language]}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/50">
            Duration: <span className="font-bold text-studio-gold">{durLabel}</span>
          </label>
          <div className="mb-2 flex gap-1.5">
            {[60, 120, 180, 300, 600].map((m) => (
              <button
                key={m}
                onClick={() => setDuration(m)}
                className={`flex-1 rounded-lg border py-1.5 text-[11px] font-bold transition
                  ${duration === m
                    ? "border-studio-gold bg-studio-gold/15 text-studio-gold"
                    : "border-white/10 bg-studio-input text-white/45 hover:border-white/25"}`}
              >
                {m / 60}m
              </button>
            ))}
          </div>
          <input
            type="range" min={15} max={600} step={15} value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="studio-range w-full"
            style={{ ["--fill" as any]: `${fill}%` }}
          />
          <div className="mt-1 text-[10px] text-white/25">Slide for fine-tuning (15s – 10 min)</div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-white/50">Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-xl border-2 border-studio-gold bg-studio-gold/10 px-3 py-2.5 text-left">
              <div className="text-[12px] font-bold text-studio-gold">Long-form 16:9</div>
              <div className="text-[10px] text-white/40">YouTube · landscape</div>
            </button>
            <button
              disabled
              title="Coming soon"
              className="relative cursor-not-allowed rounded-xl border border-white/10 bg-studio-input px-3 py-2.5 text-left opacity-50"
            >
              <div className="text-[12px] font-bold text-white/50">Short 9:16</div>
              <div className="text-[10px] text-white/30">TikTok · vertical</div>
              <span className="absolute right-2 top-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-white/40">soon</span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={submit}
        disabled={running || !topic.trim()}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-studio-gold to-orange-500 py-3 text-[15px] font-extrabold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {running ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Producing…</>
        ) : (
          <><Clapperboard className="h-4 w-4" /> Generate Video</>
        )}
      </button>
    </section>
  );
}
