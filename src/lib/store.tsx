import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type CountryStat = { c: number; w: number; learned: boolean };
export type QuizResult = {
  id: string;
  date: number;
  mode: "quiz" | "mapa";
  score: number;
  total: number;
};
export type Store = {
  stats: Record<string, CountryStat>;
  history: QuizResult[];
  bestStreak: number;
};

const KEY = "kompas-europa-v1";
const EMPTY: Store = { stats: {}, history: [], bestStreak: 0 };

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return {
      stats: p.stats ?? {},
      history: Array.isArray(p.history) ? p.history : [],
      bestStreak: p.bestStreak ?? 0,
    };
  } catch {
    return EMPTY;
  }
}

interface StoreApi {
  store: Store;
  statOf: (id: string) => CountryStat;
  /** zwraca true, jeśli państwo zostało właśnie automatycznie opanowane */
  recordAnswer: (id: string, correct: boolean) => boolean;
  toggleLearned: (id: string) => void;
  addHistory: (r: Omit<QuizResult, "id" | "date">) => void;
  bumpStreak: (n: number) => void;
  reset: () => void;
  learnedCount: number;
}

const Ctx = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(load);
  const ref = useRef(store);
  ref.current = store;

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(store));
    } catch {
      /* pamięć niedostępna — gramy dalej bez zapisu */
    }
  }, [store]);

  const statOf = useCallback(
    (id: string): CountryStat => store.stats[id] ?? { c: 0, w: 0, learned: false },
    [store]
  );

  const recordAnswer = useCallback((id: string, correct: boolean) => {
    const cur = ref.current.stats[id] ?? { c: 0, w: 0, learned: false };
    const next: CountryStat = {
      c: cur.c + (correct ? 1 : 0),
      w: cur.w + (correct ? 0 : 1),
      learned: cur.learned,
    };
    let autoLearned = false;
    if (!next.learned && next.c >= 3 && next.c - next.w >= 2) {
      next.learned = true;
      autoLearned = true;
    }
    setStore((s) => ({ ...s, stats: { ...s.stats, [id]: next } }));
    return autoLearned;
  }, []);

  const toggleLearned = useCallback((id: string) => {
    setStore((s) => {
      const cur = s.stats[id] ?? { c: 0, w: 0, learned: false };
      return { ...s, stats: { ...s.stats, [id]: { ...cur, learned: !cur.learned } } };
    });
  }, []);

  const addHistory = useCallback((r: Omit<QuizResult, "id" | "date">) => {
    setStore((s) => ({
      ...s,
      history: [
        { ...r, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: Date.now() },
        ...s.history,
      ].slice(0, 30),
    }));
  }, []);

  const bumpStreak = useCallback((n: number) => {
    setStore((s) => (n > s.bestStreak ? { ...s, bestStreak: n } : s));
  }, []);

  const reset = useCallback(() => setStore(EMPTY), []);

  const learnedCount = Object.values(store.stats).filter((s) => s.learned).length;

  return (
    <Ctx.Provider
      value={{ store, statOf, recordAnswer, toggleLearned, addHistory, bumpStreak, reset, learnedCount }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): StoreApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore poza StoreProvider");
  return v;
}

/* ---------- toasty ---------- */

export type ToastKind = "ok" | "warn" | "info";
interface Toast {
  id: number;
  msg: string;
  kind: ToastKind;
}

const ToastCtx = createContext<(msg: string, kind?: ToastKind) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, msg, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`}>
            <span
              className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                t.kind === "ok" ? "bg-[#3ecf8e]" : t.kind === "warn" ? "bg-[#f26d6d]" : "bg-[#58b4e8]"
              }`}
            />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
