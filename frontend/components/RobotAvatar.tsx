"use client";
import { motion } from "framer-motion";
import type { AgentStatus } from "@/lib/types";

const PALETTE: Record<AgentStatus, { main: string; glow: string; dim: string }> = {
  idle: { main: "#5b6b85", glow: "rgba(91,107,133,0.35)", dim: "#2a3348" },
  working: { main: "#f5a623", glow: "rgba(245,166,35,0.45)", dim: "#3a2c10" },
  done: { main: "#34d399", glow: "rgba(52,211,153,0.4)", dim: "#0f2f24" },
  error: { main: "#f87171", glow: "rgba(248,113,113,0.4)", dim: "#3a1414" },
};

export default function RobotAvatar({ status, size = 64 }: { status: AgentStatus; size?: number }) {
  const c = PALETTE[status];
  const working = status === "working";
  return (
    <motion.div
      animate={working ? { y: [0, -4, 0] } : { y: 0 }}
      transition={working ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : {}}
      style={{ width: size, height: size }}
      className="relative shrink-0"
    >
      <div
        className="absolute inset-0 rounded-2xl blur-md"
        style={{ background: c.glow }}
      />
      <svg viewBox="0 0 64 64" width={size} height={size} className="relative">
        {/* antenna */}
        <line x1="32" y1="10" x2="32" y2="4" stroke={c.main} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="3.5" r="2.5" fill={c.main} opacity={working ? 1 : 0.6}>
          {working && (
            <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
        {/* head */}
        <rect x="15" y="10" width="34" height="24" rx="9" fill="#1b2942" stroke={c.main} strokeWidth="2" />
        {/* eyes */}
        <circle cx="25" cy="21" r="3.4" fill={c.main}>
          {working && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="39" cy="21" r="3.4" fill={c.main}>
          {working && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          )}
        </circle>
        {/* smile */}
        <path d="M26 28 Q32 32 38 28" stroke={c.main} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* ears */}
        <rect x="11" y="18" width="4" height="8" rx="2" fill={c.main} opacity="0.7" />
        <rect x="49" y="18" width="4" height="8" rx="2" fill={c.main} opacity="0.7" />
        {/* body */}
        <rect x="21" y="37" width="22" height="17" rx="7" fill="#1b2942" stroke={c.main} strokeWidth="2" />
        <circle cx="32" cy="45.5" r="3" fill={c.main} opacity="0.85" />
        {/* arms */}
        <rect x="14" y="40" width="5" height="11" rx="2.5" fill={c.main} opacity="0.55" />
        <rect x="45" y="40" width="5" height="11" rx="2.5" fill={c.main} opacity="0.55" />
        {/* legs */}
        <rect x="24" y="54" width="6" height="7" rx="3" fill={c.main} opacity="0.55" />
        <rect x="34" y="54" width="6" height="7" rx="3" fill={c.main} opacity="0.55" />
      </svg>
    </motion.div>
  );
}
