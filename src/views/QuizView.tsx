import { useEffect, useMemo, useRef, useState } from "react";
import {
  COUNTRIES,
  REGIONS,
  type Country,
  type Region,
  shuffle,
} from "../data/countries";
import { useStore, useToast } from "../lib/store";
import { RegionPicker, ResultCard, type WrongItem } from "../components/ui";
import { IconArrow, IconFlame, IconShuffle } from "../components/icons";

type Dir = "c2cap" | "cap2c";

interface Q {
  country: Country;
  prompt: string;
  options: string[];
  answer: string;
}

function buildQuestions(pool: Country[], count: number, dir: Dir): Q[] {
  const picks = shuffle(pool).slice(0, Math.min(count, pool.length));
  const src = pool.length >= 5 ? pool : COUNTRIES;
  return picks.map((c) => {
    const answer = dir === "c2cap" ? c.capital : c.name;
    const opts = new Set<string>([answer]);
    while (opts.size < 4) {
      const r = src[Math.floor(Math.random() * src.length)];
      opts.add(dir === "c2cap" ? r.capital : r.name);
    }
    return { country: c, prompt: answer, options: shuffle([...opts]), answer };
  });
}

export default function QuizView() {
  const { recordAnswer, bumpStreak, addHistory } = useStore();
  const toast = useToast();

  const [phase, setPhase] = useState<"setup" | "play" | "done">("setup");
  const [dir, setDir] = useState<Dir>("c2cap");
  const [region, setRegion] = useState<"all" | Region>("all");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<WrongItem[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionBest, setSessionBest] = useState(0);
  const timer = useRef<number | null>(null);

  const pool = useMemo(
    () => COUNTRIES.filter((c) => region === "all" || c.region === region),
    [region]
  );

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const start = () => {
    setQuestions(buildQuestions(pool, count, dir));
    setIdx(0);
    setPicked(null);
    setWrong([]);
    setScore(0);
    setStreak(0);
    setSessionBest(0);
    setPhase("play");
  };

  const finish = (finalScore: number, finalWrong: WrongItem[], total: number) => {
    addHistory({ mode: "quiz", score: finalScore, total });
    setPhase("done");
  };

  const pick = (opt: string) => {
    if (picked !== null || phase !== "play") return;
    const q = questions[idx];
    const ok = opt === q.answer;
    setPicked(opt);

    const auto = recordAnswer(q.country.id, ok);
    let newStreak = streak;
    if (ok) {
      newStreak = streak + 1;
      setStreak(newStreak);
      setSessionBest((b) => Math.max(b, newStreak));
      bumpStreak(newStreak);
      setScore((s) => s + 1);
      if (auto) toast(`${q.country.name} — opanowane automatycznie!`, "ok");
    } else {
      setStreak(0);
      setWrong((w) => [
        ...w,
        {
          country: q.country,
          given: opt,
          correct: q.answer,
        },
      ]);
    }

    const finalScore = ok ? score + 1 : score;
    const finalWrong = ok
      ? wrong
      : [...wrong, { country: q.country, given: opt, correct: q.answer }];

    timer.current = window.setTimeout(() => {
      if (idx + 1 >= questions.length) {
        finish(finalScore, finalWrong, questions.length);
      } else {
        setIdx((i) => i + 1);
        setPicked(null);
      }
    }, 1200);
  };

  /* klawiatura: 1–4 */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (phase !== "play" || picked !== null) return;
      const n = parseInt(e.key, 10);
      const q = questions[idx];
      if (n >= 1 && n <= 4 && q?.options[n - 1]) pick(q.options[n - 1]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  /* ---------- setup ---------- */
  if (phase === "setup") {
    return (
      <div className="panel max-w-xl mx-auto p-6 sm:p-8 animate-popIn">
        <div className="lbl">Quiz wyboru · 4 odpowiedzi</div>
        <h2 className="font-display text-2xl font-extrabold mt-1">Sprawdź, co już umiesz</h2>
        <p className="text-sm text-[#94aac6] mt-2 leading-relaxed">
          Każda odpowiedź liczy się do postępu — 3 trafienia bez pomyłek automatycznie oznaczają
          państwo jako opanowane.
        </p>

        <div className="lbl mt-6">Kierunek pytań</div>
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

        <div className="lbl mt-5">Liczba pytań</div>
        <div className="flex gap-2 mt-1.5">
          {[8, 10, 15].map((n) => (
            <button key={n} className={`chip ${count === n ? "chip-on" : ""}`} onClick={() => setCount(n)}>
              {n}
            </button>
          ))}
        </div>

        <button className="btn btn-amber w-full justify-center mt-7" onClick={start}>
          <IconShuffle className="w-4 h-4" />
          Start quizu ({Math.min(count, pool.length)} pytań)
        </button>
      </div>
    );
  }

  /* ---------- wynik ---------- */
  if (phase === "done") {
    return (
      <ResultCard
        score={score}
        total={questions.length}
        wrong={wrong}
        label={dir === "c2cap" ? "państwo → stolica" : "stolica → państwo"}
        onRetry={start}
        onMap={() => setPhase("setup")}
      />
    );
  }

  /* ---------- gra ---------- */
  const q = questions[idx];
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="max-w-2xl mx-auto animate-view">
      <div className="flex items-center gap-3 mb-5">
        <div className="font-display font-bold text-sm whitespace-nowrap">
          {idx + 1}<span className="text-[#647d9e]">/{questions.length}</span>
        </div>
        <div className="flex-1 h-2 rounded-full bg-[#122440] border border-[#1e3554] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f6b94b] to-[#3ecf8e] transition-all duration-500"
            style={{ width: `${(idx / questions.length) * 100}%` }}
          />
        </div>
        {streak >= 2 && (
          <span className="flex items-center gap-1 text-[#f6b94b] font-display font-bold text-sm animate-popIn" key={streak}>
            <IconFlame className="w-4 h-4" /> {streak}
          </span>
        )}
      </div>

      <div className="panel p-6 sm:p-8 text-center">
        <div className="lbl">{dir === "c2cap" ? "Podaj stolicę państwa" : "Podaj państwo o tej stolicy"}</div>
        <div className="font-display text-[34px] sm:text-[42px] font-extrabold mt-4 leading-tight">
          {dir === "c2cap" ? q.country.name : q.prompt}
        </div>
        <div className="text-sm text-[#647d9e] mt-2">
          {dir === "c2cap" ? REGIONS[q.country.region] : "kliknij właściwe państwo (klawisze 1–4 też działają)"}
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5 mt-7 text-left">
          {q.options.map((opt, i) => {
            let cls = "opt";
            if (picked !== null) {
              if (opt === q.answer) cls += " opt-good";
              else if (opt === picked) cls += " opt-bad";
              else cls += " opt-dim";
            }
            return (
              <button key={opt} className={cls} onClick={() => pick(opt)} disabled={picked !== null}>
                <span className="opt-letter">{letters[i]}</span>
                <span className="font-semibold">{opt}</span>
              </button>
            );
          })}
        </div>

        <div className="h-6 mt-4 text-sm font-semibold">
          {picked !== null &&
            (picked === q.answer ? (
              <span className="text-[#3ecf8e] animate-popIn inline-block">Dobrze! {q.country.name} → {q.country.capital}</span>
            ) : (
              <span className="text-[#f26d6d] animate-popIn inline-block">
                Niestety — poprawna odpowiedź: {q.answer}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
