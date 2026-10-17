"use client";
import { CheckCircle2 } from "lucide-react";

export interface StylePreset {
  id: string;
  blurb: string;
  img: string;
  tags: string[];
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "Cinematic explainer documentary",
    blurb: "Vox / Johnny Harris look: chapter labels, letterbox, fact and quote cards",
    img: "/categories/documentary.jpg",
    tags: ["Explainers", "Geopolitics", "Big ideas"],
  },
  {
    id: "3D Recreation",
    blurb: "Playful 3D cartoon look for stories and explainers",
    img: "/categories/cartoon.jpg",
    tags: ["Kids", "Stories"],
  },
  {
    id: "Anime saga",
    blurb: "Epic anime frames with dramatic light and motion",
    img: "/categories/anime.jpg",
    tags: ["Anime", "Action"],
  },
];

export default function StyleColumn({
  selected, onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/5 bg-studio-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-white">Style</h2>
        <span className="text-[11px] text-white/30">How your video looks</span>
      </div>

      <div className="space-y-4">
        {STYLE_PRESETS.map((s) => {
          const active = s.id === selected;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group block w-full overflow-hidden rounded-xl border-2 text-left transition
                ${active ? "border-studio-gold shadow-glow" : "border-white/10 hover:border-white/25"}`}
            >
              <div className="relative">
                <img src={s.img} alt={s.id} className="h-32 w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute left-2.5 top-2.5 rounded-md bg-studio-gold px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-black">
                  Featured
                </span>
                {active && (
                  <CheckCircle2 className="absolute right-2.5 top-2.5 h-5 w-5 text-studio-gold drop-shadow" />
                )}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <div className={`text-[15px] font-extrabold leading-tight ${active ? "text-studio-gold" : "text-white"}`}>
                    {s.id}
                  </div>
                </div>
              </div>
              <div className="bg-studio-card px-3.5 py-3">
                <p className="text-[11px] leading-relaxed text-white/50">{s.blurb}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        active
                          ? "border-studio-gold/40 bg-studio-gold/10 text-studio-gold"
                          : "border-white/10 bg-white/5 text-white/45"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 text-[11px] text-white/30">
        The director frames every scene in this style.
      </div>
    </section>
  );
}
