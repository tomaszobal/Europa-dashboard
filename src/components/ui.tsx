import React from "react";
import { REGIONS, REGION_ORDER, type Region, type Country, flag } from "../data/countries";
import { IconArrow, IconMap, IconRefresh, IconTrophy, IconX } from "./icons";

/* ---------- Ring (kołowy pasek postępu) ---------- */

export function Ring({
  value,
  size = 130,
  stroke = 11,
  color = "#f6b94b",
  track = "#1e3554",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))}
          style={{ transition: "stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ---------- Modal ---------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-[#060f1d]/75 animate-fadeIn" onClick={onClose} />
      <div className="relative panel w-full max-w-md p-6 animate-popIn">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="icon-btn" aria-label="Zamknij">
            <IconX className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="text-sm text-[#94aac6] leading-relaxed">{children}</div>
        {actions && <div className="flex justify-end gap-2 mt-6">{actions}</div>}
      </div>
    </div>
  );
}

/* ---------- Wybór regionu ---------- */

export function RegionPicker({
  value,
  onChange,
}: {
  value: "all" | Region;
  onChange: (r: "all" | Region) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onChange("all")}
        className={`chip ${value === "all" ? "chip-on" : ""}`}
      >
        Wszystkie
      </button>
      {REGION_ORDER.map((r) => (
        <button key={r} onClick={() => onChange(r)} className={`chip ${value === r ? "chip-on" : ""}`}>
          {REGIONS[r]}
        </button>
      ))}
    </div>
  );
}

/* ---------- Wynik quizu ---------- */

export interface WrongItem {
  country: Country;
  given?: string;
  correct: string;
}

export function ResultCard({
  score,
  total,
  wrong,
  onRetry,
  onMap,
  label,
}: {
  score: number;
  total: number;
  wrong: WrongItem[];
  onRetry: () => void;
  onMap: () => void;
  label: string;
}) {
  const pct = total ? score / total : 0;
  const verdict =
    pct >= 0.9 ? "Mistrz kompasu!" : pct >= 0.7 ? "Świetna robota!" : pct >= 0.5 ? "Dobry kurs!" : "Jeszcze trochę praktyki!";
  const color = pct >= 0.7 ? "#3ecf8e" : pct >= 0.5 ? "#f6b94b" : "#f26d6d";

  return (
    <div className="panel p-6 sm:p-8 max-w-2xl mx-auto animate-popIn">
      <div className="flex flex-col sm:flex-row items-center gap-7">
        <Ring value={pct} color={color} size={150} stroke={13}>
          <div className="text-center">
            <div className="font-display text-4xl font-extrabold leading-none">{score}/{total}</div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#647d9e] mt-1">{label}</div>
          </div>
        </Ring>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-[#f6b94b]">
            <IconTrophy className="w-6 h-6" />
            <span className="font-display text-2xl font-bold text-[#e9f2fb]">{verdict}</span>
          </div>
          <p className="text-sm text-[#94aac6] mt-2 leading-relaxed">
            {pct >= 0.7
              ? "Tak trzymaj — mapa Europy nie ma przed Tobą tajemnic."
              : "Zajrzyj na mapę, podpatrz trudne państwa i spróbuj jeszcze raz."}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-5">
            <button className="btn btn-amber" onClick={onRetry}>
              <IconRefresh className="w-4 h-4" /> Zagraj ponownie
            </button>
            <button className="btn btn-ghost" onClick={onMap}>
              <IconMap className="w-4 h-4" /> Wróć do mapy
            </button>
          </div>
        </div>
      </div>

      {wrong.length > 0 && (
        <div className="mt-7">
          <div className="lbl mb-2.5">Do powtórki ({wrong.length})</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {wrong.map((w, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-[#0b1b30]/70 border border-[#1e3554] px-3.5 py-2.5">
                <span className="text-lg leading-none">{flag(w.country.iso2)}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{w.country.name}</div>
                  <div className="text-xs text-[#647d9e]">
                    {w.given ? (
                      <>
                        <span className="text-[#f26d6d] line-through">{w.given}</span>
                        <IconArrow className="inline w-3 h-3 mx-1 -mt-0.5" />
                      </>
                    ) : null}
                    <span className="text-[#3ecf8e] font-medium">{w.correct}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Stat chip ---------- */

export function StatChip({
  icon,
  value,
  label,
  tone = "amber",
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone?: "amber" | "green" | "sky";
}) {
  const tones: Record<string, string> = {
    amber: "text-[#f6b94b] border-[#f6b94b]/25 bg-[#f6b94b]/8",
    green: "text-[#3ecf8e] border-[#3ecf8e]/25 bg-[#3ecf8e]/8",
    sky: "text-[#58b4e8] border-[#58b4e8]/25 bg-[#58b4e8]/8",
  };
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2 ${tones[tone]}`}>
      {icon}
      <div className="leading-tight">
        <div className="font-display font-bold text-[15px] text-[#e9f2fb]">{value}</div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-[#647d9e]">{label}</div>
      </div>
    </div>
  );
}
