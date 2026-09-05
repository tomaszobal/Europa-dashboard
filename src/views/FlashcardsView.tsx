import { useMemo, useState } from "react";
import {
  COUNTRIES,
  byId,
  flag,
  REGIONS,
  type Region,
  shuffle,
} from "../data/countries";
import { IconArrow, IconCheck, IconRefresh, IconShuffle, IconX } from "../components/icons";
import { RegionPicker, Ring } from "../components/ui";

type Dir = "c2cap" | "cap2c";

export default function FlashcardsView() {
  const [phase, setPhase] = useState<"setup" | "play">("setup");
  const [dir, setDir] = useState<Dir>("c2cap");
  const [region, setRegion] = useState<"all" | Region>("all");
  const [queue, setQueue] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownFirst, setKnownFirst] = useState(0);
  const [firstMiss, setFirstMiss] = useState<Set<string>>(new Set());

  const pool = useMemo(
    () => COUNTRIES.filter((c) => region === "all" || c.region === region),
    [region]
  );

  const start = () => {
    const ids = shuffle(pool.map((c) => c.id));
    setQueue(ids);
    setTotal(ids.length);
    setFlipped(false);
    setKnownFirst(0);
    setFirstMiss(new Set());
    setPhase("play");
  };

  const current = queue.length ? byId[queue[0]] : null;
  const done = phase === "play" && queue.length === 0;

  const grade = (known: boolean) => {
    if (!current) return;
    if (known) {
      if (!firstMiss.has(current.id)) setKnownFirst((k) => k + 1);
      setQueue((q) => q.slice(1));
    } else {
      setFirstMiss((m) => new Set(m).add(current.id));
      setQueue((q) => [...q.slice(1), q[0]]);
    }
    setFlipped(false);
  };

  /* ---------- setup ---------- */
  if (phase === "setup") {
    return (
      <div className="panel max-w-xl mx-auto p-6 sm:p-8 animate-popIn">
        <div className="lbl">Fiszki · trening</div>
        <h2 className="font-display text-2xl font-extrabold mt-1">
          Odwracaj karty, aż wszystko zostanie w głowie
        </h2>
        <p className="text-sm text-[#94aac6] mt-2 leading-relaxed">
          Nieznane karty wracają na koniec kolejki — talia kończy się dopiero, gdy znasz każdą parę.
        </p>

        <div className="lbl mt-6">Kierunek</div>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          <button className={`seg ${dir === "c2cap" ? "seg-on" : ""}`} onClick={() => setDir("c2cap")}>
            Państwo <IconArrow className="w-3.5 h-3.5" /> stolica
          </button>
          <button className={`seg ${dir === "cap2c" ? "seg-on" : ""}`} onClick={() => setDir("cap2c")}>
            Stolica <IconArrow className="w-3.5 h-3.5" /> państwo
          </button>
        </div>

        <div className="lbl mt-5">Zakres</div>
        <div className="mt-1.5">
          <RegionPicker value={region} onChange={setRegion} />
        </div>

        <button className="btn btn-amber w-full justify-center mt-7" onClick={start}>
          <IconShuffle className="w-4 h-4" />
          Tasuj i start ({pool.length} kart)
        </button>
      </div>
    );
  }

  /* ---------- podsumowanie ---------- */
  if (done) {
    const pct = total ? knownFirst / total : 0;
    return (
      <div className="panel max-w-xl mx-auto p-6 sm:p-8 text-center animate-popIn">
        <Ring value={pct} color={pct >= 0.7 ? "#3ecf8e" : "#f6b94b"} size={140} stroke={12}>
          <div>
            <div className="font-display text-3xl font-extrabold">{knownFirst}/{total}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#647d9e]">za 1. razem</div>
          </div>
        </Ring>
        <h2 className="font-display text-2xl font-extrabold mt-5">Talia rozegrana!</h2>
        <p className="text-sm text-[#94aac6] mt-2">
          {total - knownFirst > 0
            ? `${total - knownFirst} ${total - knownFirst === 1 ? "karta potrzebowała" : "karty potrzebowały"} powtórki — i właśnie dlatego zostały w głowie.`
            : "Wszystkie karty za pierwszym razem — rewelacja!"}
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <button className="btn btn-amber" onClick={start}>
            <IconRefresh className="w-4 h-4" /> Jeszcze raz
          </button>
          <button className="btn btn-ghost" onClick={() => setPhase("setup")}>
            Zmień ustawienia
          </button>
        </div>
      </div>
    );
  }

  /* ---------- gra ---------- */
  const front = dir === "c2cap" ? current!.name : current!.capital;
  const back = dir === "c2cap" ? current!.capital : current!.name;
  const solved = total - queue.length;

  return (
    <div className="max-w-xl mx-auto animate-view">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 rounded-full bg-[#122440] border border-[#1e3554] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f6b94b] to-[#3ecf8e] transition-all duration-500"
            style={{ width: `${(solved / Math.max(1, total)) * 100}%` }}
          />
        </div>
        <div className="text-xs font-semibold text-[#94aac6] whitespace-nowrap">
          zostało {queue.length} / {total}
        </div>
        <button className="icon-btn" onClick={() => setPhase("setup")} title="Przerwij">
          <IconX className="w-4 h-4" />
        </button>
      </div>

      <div
        key={current!.id}
        className={`flip-card h-[300px] cursor-pointer ${flipped ? "" : "hover:scale-[1.012]"} transition-transform`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className={`flip-inner h-full ${flipped ? "flipped" : ""}`}>
          <div className="flip-face card-face">
            <div className="lbl">{dir === "c2cap" ? "Podaj stolicę" : "Podaj państwo"}</div>
            <div className="text-[52px] leading-none mt-5">{flag(current!.iso2)}</div>
            <div className="font-display text-[32px] sm:text-4xl font-extrabold mt-4 px-6 text-center">
              {front}
            </div>
            {dir === "c2cap" && (
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#647d9e] mt-3">
                {REGIONS[current!.region]}
              </div>
            )}
            <div className="absolute bottom-4 text-[11px] text-[#647d9e]">
              kliknij kartę, aby odwrócić
            </div>
          </div>
          <div className="flip-face flip-back card-face card-back">
            <div className="lbl text-[#3ecf8e]">
              {dir === "c2cap" ? "Stolica to" : "To państwo to"}
            </div>
            <div className="font-display text-[34px] sm:text-[40px] font-extrabold text-[#3ecf8e] mt-6 px-6 text-center">
              {back}
            </div>
            <div className="text-sm text-[#94aac6] mt-3">
              {flag(current!.iso2)} {current!.name} → {current!.capital}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          className="btn btn-coral justify-center text-[15px] disabled:opacity-35 disabled:pointer-events-none"
          disabled={!flipped}
          onClick={() => grade(false)}
        >
          <IconX className="w-4 h-4" /> Nie znam
        </button>
        <button
          className="btn btn-green justify-center text-[15px] disabled:opacity-35 disabled:pointer-events-none"
          disabled={!flipped}
          onClick={() => grade(true)}
        >
          <IconCheck className="w-4 h-4" /> Znam!
        </button>
      </div>
      {!flipped && (
        <p className="text-center text-xs text-[#647d9e] mt-3">
          Najpierw odwróć kartę i sprawdź się uczciwie.
        </p>
      )}
    </div>
  );
}


