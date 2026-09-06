import { useEffect, useRef, useState } from "react";
import EuropeMap, { type FxMap } from "../components/EuropeMap";
import {
  byId,
  COUNTRIES,
  flag,
  MAP_QUIZ_EXCLUDE,
  shuffle,
  type Country,
} from "../data/countries";
import { useStore, useToast } from "../lib/store";
import { ResultCard, type WrongItem } from "../components/ui";
import { IconCheck, IconFlame, IconPin, IconTarget, IconX } from "../components/icons";

const ROUNDS = 10;

export default function MapQuizView() {
  const { recordAnswer, bumpStreak, addHistory } = useStore();
  const toast = useToast();

  const [phase, setPhase] = useState<"setup" | "play" | "done">("setup");
  const [targets, setTargets] = useState<Country[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrong, setWrong] = useState<WrongItem[]>([]);
  const [fx, setFx] = useState<FxMap>({});
  const [fxKey, setFxKey] = useState(0);
  const [locked, setLocked] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const start = () => {
    const pool = COUNTRIES.filter((c) => !MAP_QUIZ_EXCLUDE.has(c.id));
    setTargets(shuffle(pool).slice(0, ROUNDS));
    setIdx(0);
    setScore(0);
    setStreak(0);
    setWrong([]);
    setFx({});
    setLocked(false);
    setMsg(null);
    setPhase("play");
  };

  const target = targets[idx];

  const next = (finalScore: number, finalWrong: WrongItem[]) => {
    if (idx + 1 >= targets.length) {
      addHistory({ mode: "mapa", score: finalScore, total: targets.length });
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setFx({});
      setLocked(false);
      setMsg(null);
    }
  };

  const answer = (clickedId: string | null) => {
    if (locked || !target) return;
    setLocked(true);
    setFxKey((k) => k + 1);

    if (clickedId === target.id) {
      setFx({ [target.id]: "good" });
      const newStreak = streak + 1;
      setStreak(newStreak);
      bumpStreak(newStreak);
      setScore((s) => s + 1);
      setMsg({ kind: "ok", text: `Tak! To ${target.name}.` });
      if (recordAnswer(target.id, true)) toast(`${target.name} — opanowane automatycznie!`, "ok");
      timer.current = window.setTimeout(() => next(score + 1, wrong), 1300);
    } else {
      const newFx: FxMap = { [target.id]: "reveal" };
      if (clickedId) newFx[clickedId] = "bad";
      setFx(newFx);
      setStreak(0);
      const given = clickedId ? byId[clickedId]?.name : "brak odpowiedzi";
      setWrong((w) => [...w, { country: target, given, correct: target.name }]);
      setMsg({
        kind: "bad",
        text: clickedId
          ? `To ${byId[clickedId]?.name ?? "inne państwo"} — szukaliśmy: ${target.name}.`
          : `Szukaliśmy: ${target.name}.`,
      });
      recordAnswer(target.id, false);
      timer.current = window.setTimeout(() => next(score, [
        ...wrong,
        { country: target, given, correct: target.name },
      ]), 1900);
    }
  };

  if (phase === "setup") {
    return (
      <div className="panel max-w-xl mx-auto p-6 sm:p-8 animate-popIn">
        <div className="lbl">Quiz na mapie · {ROUNDS} rund</div>
        <h2 className="font-display text-2xl font-extrabold mt-1">Pokaż mi to na mapie!</h2>
        <p className="text-sm text-[#94aac6] mt-2 leading-relaxed">
          Dostaniesz nazwę państwa, a Ty klikniesz je na mapie. Bez podpowiedzi po najechaniu —
          tylko Ty i Europa. Mikropaństwa (jak Watykan czy Monako) pomijamy, bo są mniejsze niż
          kropka na mapie.
        </p>
        <button className="btn btn-amber w-full justify-center mt-7" onClick={start}>
          <IconTarget className="w-4 h-4" /> Start — {ROUNDS} państw do znalezienia
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <ResultCard
        score={score}
        total={targets.length}
        wrong={wrong}
        label="znalezione na mapie"
        onRetry={start}
        onMap={() => setPhase("setup")}
      />
    );
  }

  return (
    <div className="panel p-4 sm:p-5 animate-view">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
        <div>
          <div className="lbl mb-0.5">Runda {idx + 1}/{targets.length} · znajdź:</div>
          <div className="font-display text-2xl sm:text-[28px] font-extrabold leading-tight flex items-center gap-2.5">
            <span className="text-[26px]">{flag(target.iso2)}</span> {target.name}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-[#f6b94b] font-display font-bold" key={streak}>
              <IconFlame className="w-4 h-4" /> {streak}
            </span>
          )}
          <span className="chip chip-on pointer-events-none">
            <IconPin className="w-3.5 h-3.5" /> {score} pkt
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => answer(null)}
            disabled={locked}
          >
            <IconX className="w-3.5 h-3.5" /> Nie wiem
          </button>
        </div>
      </div>

      <div
        className={`rounded-xl border px-4 py-2.5 mb-3 text-sm font-semibold transition-colors ${
          msg
            ? msg.kind === "ok"
              ? "border-[#3ecf8e]/40 bg-[#3ecf8e]/10 text-[#3ecf8e]"
              : "border-[#f26d6d]/40 bg-[#f26d6d]/10 text-[#f26d6d]"
            : "border-[#1e3554] bg-[#0b1b30]/60 text-[#94aac6]"
        }`}
      >
        {msg ? (
          <span className="inline-flex items-center gap-2 animate-popIn">
            {msg.kind === "ok" ? <IconCheck className="w-4 h-4" /> : <IconX className="w-4 h-4" />}
            {msg.text}
          </span>
        ) : (
          "Kliknij państwo na mapie. Zielony błysk = trafienie, czerwony = pudło."
        )}
      </div>

      <EuropeMap
        classFor={() => "eu-q"}
        onSelect={(id) => answer(id)}
        fx={fx}
        fxKey={fxKey}
      />
    </div>
  );
}
