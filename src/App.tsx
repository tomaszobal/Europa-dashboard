import React, { useEffect, useState } from "react";
import { StoreProvider, ToastProvider, useStore } from "./lib/store";
import ExploreView from "./views/ExploreView";
import FlashcardsView from "./views/FlashcardsView";
import QuizView from "./views/QuizView";
import MapQuizView from "./views/MapQuizView";
import ProgressView from "./views/ProgressView";
import {
  IconCards,
  IconChart,
  IconCompass,
  IconFlame,
  IconMap,
  IconPin,
  IconQuiz,
} from "./components/icons";
import { COUNTRIES } from "./data/countries";

type Mode = "mapa" | "fiszki" | "quiz" | "mapquiz" | "postepy";

const NAV: { mode: Mode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { mode: "mapa", label: "Mapa Europy", icon: IconMap },
  { mode: "fiszki", label: "Fiszki", icon: IconCards },
  { mode: "quiz", label: "Quiz", icon: IconQuiz },
  { mode: "mapquiz", label: "Quiz na mapie", icon: IconPin },
  { mode: "postepy", label: "Postępy", icon: IconChart },
];

const HEAD: Record<Mode, { t: string; s: string }> = {
  mapa: { t: "Mapa Europy", s: "Najedź, kliknij i poznaj 47 państw oraz ich stolice." },
  fiszki: { t: "Fiszki", s: "Szybkie powtórki — odwracaj karty i oceniaj się uczciwie." },
  quiz: { t: "Quiz", s: "Cztery odpowiedzi, jedno trafienie. Buduj serię!" },
  mapquiz: { t: "Quiz na mapie", s: "Dostajesz nazwę — pokaż palcem, gdzie to jest." },
  postepy: { t: "Postępy", s: "Twoja droga do mistrzostwa mapy Europy." },
};

const TIPS = [
  "Zacznij od państw, które znasz z wakacji — Włochy, Chorwacja, Grecja.",
  "Stolica-wyjątek: Szwajcaria ma Berno, a nie Zurych!",
  "W Holandii stolica to Amsterdam, choć rząd urzęduje w Hadze.",
  "Ucz się regionami: północ → zachód → południe → wschód.",
  "3 trafienia bez 2 pomyłek = państwo opanowane automatycznie.",
  "Stolica Turcji to Ankara — nie Stambuł, choć to on jest słynniejszy.",
  "Watykan, Monako i San Marino to państwa mniejsze od Twojej szkoły.",
];

function TipBox() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % TIPS.length), 8000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="rounded-xl border border-[#1e3554] bg-[#0b1b30]/70 p-3.5">
      <div className="lbl mb-1.5">Wskazówka nawigatora</div>
      <p key={i} className="text-xs text-[#94aac6] leading-relaxed animate-fadeIn">
        {TIPS[i]}
      </p>
    </div>
  );
}

function MiniRing({ value }: { value: number }) {
  const r = 13;
  const c = 2 * Math.PI * r;
  return (
    <svg width="34" height="34" className="-rotate-90">
      <circle cx="17" cy="17" r={r} stroke="#1e3554" strokeWidth="4" fill="none" />
      <circle
        cx="17"
        cy="17"
        r={r}
        stroke="#f6b94b"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))}
        style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.7,.2,1)" }}
      />
    </svg>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#f6b94b] text-[#0a1626] shadow-[0_6px_18px_rgba(246,185,75,.3)]">
        <IconCompass className="w-6 h-6" />
      </span>
      <div>
        <div className="font-display text-lg font-extrabold leading-none tracking-wide">KOMPAS</div>
        <div className="text-[9.5px] uppercase tracking-[0.22em] text-[#647d9e] mt-1">
          Atlas Europy · klasa 6
        </div>
      </div>
    </div>
  );
}

function Shell() {
  const [mode, setMode] = useState<Mode>("mapa");
  const { learnedCount, store } = useStore();

  const navBtn = (n: (typeof NAV)[number], compact = false) => {
    const Icon = n.icon;
    const on = mode === n.mode;
    return (
      <button
        key={n.mode}
        onClick={() => setMode(n.mode)}
        className={compact ? `nav-chip ${on ? "nav-chip-on" : ""}` : `nav-item ${on ? "nav-on" : ""}`}
      >
        <Icon className={compact ? "w-4 h-4" : "w-[18px] h-[18px]"} />
        <span>{n.label}</span>
        {!compact && n.mode === "mapa" && (
          <span className="ml-auto text-[11px] font-bold text-[#647d9e]">
            {learnedCount}/{COUNTRIES.length}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-[256px_1fr]">
      {/* ---------- sidebar (desktop) ---------- */}
      <aside className="hidden md:flex flex-col gap-5 sticky top-0 h-screen border-r border-[#16304e] bg-[#0c1a2e]/85 px-4 py-6 overflow-y-auto nice-scroll">
        <Logo />
        <nav className="flex flex-col gap-1.5 mt-2">{NAV.map((n) => navBtn(n))}</nav>

        <div className="mt-auto flex flex-col gap-3.5">
          <div className="rounded-xl border border-[#1e3554] bg-[#0b1b30]/70 p-3.5">
            <div className="flex justify-between items-baseline text-xs mb-2">
              <span className="font-bold">Opanowane</span>
              <span className="font-display font-extrabold text-[#f6b94b]">
                {learnedCount}/{COUNTRIES.length}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-[#122440] border border-[#1e3554] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(learnedCount / COUNTRIES.length) * 100}%`,
                  background: "linear-gradient(90deg,#c98f2c,#f6b94b)",
                }}
              />
            </div>
          </div>
          <TipBox />
        </div>
      </aside>

      {/* ---------- pasek mobilny ---------- */}
      <div className="md:hidden sticky top-0 z-40 border-b border-[#16304e] bg-[#0c1a2e]/95 px-4 pt-3 pb-2.5">
        <Logo />
        <nav className="flex gap-1.5 mt-3 overflow-x-auto nice-scroll pb-0.5">
          {NAV.map((n) => navBtn(n, true))}
        </nav>
      </div>

      {/* ---------- treść ---------- */}
      <div className="min-w-0">
        <header className="px-5 sm:px-8 pt-6 pb-5 flex flex-wrap items-center gap-4 justify-between">
          <div>
            <h1 className="font-display text-[26px] sm:text-[30px] font-extrabold leading-tight">
              {HEAD[mode].t}
            </h1>
            <p className="text-sm text-[#94aac6] mt-1">{HEAD[mode].s}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2.5 rounded-xl border border-[#f6b94b]/25 bg-[#f6b94b]/8 px-3 py-1.5">
              <MiniRing value={learnedCount / COUNTRIES.length} />
              <div className="leading-tight">
                <div className="font-display font-bold text-sm">
                  {learnedCount}/{COUNTRIES.length}
                </div>
                <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#647d9e]">opanowane</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#f26d6d]/25 bg-[#f26d6d]/8 px-3 py-2.5">
              <IconFlame className="w-5 h-5 text-[#f6b94b]" />
              <div className="leading-tight">
                <div className="font-display font-bold text-sm">{store.bestStreak}</div>
                <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#647d9e]">rekord serii</div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 sm:px-8 pb-20">
          <div key={mode}>
            {mode === "mapa" && <ExploreView />}
            {mode === "fiszki" && <FlashcardsView />}
            {mode === "quiz" && <QuizView />}
            {mode === "mapquiz" && <MapQuizView />}
            {mode === "postepy" && <ProgressView />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </StoreProvider>
  );
}
