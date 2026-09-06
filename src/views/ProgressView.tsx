import { useState } from "react";
import {
  COUNTRIES,
  REGIONS,
  REGION_ORDER,
  flag,
} from "../data/countries";
import { useStore, useToast } from "../lib/store";
import { Modal, Ring } from "../components/ui";
import {
  IconFlame,
  IconMap,
  IconQuiz,
  IconRefresh,
  IconTarget,
  IconTrophy,
} from "../components/icons";

export default function ProgressView() {
  const { store, statOf, toggleLearned, reset, learnedCount } = useStore();
  const toast = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const attempts = COUNTRIES.reduce((a, c) => {
    const s = statOf(c.id);
    return a + s.c + s.w;
  }, 0);
  const quizCount = store.history.length;
  const avg = quizCount
    ? Math.round((store.history.reduce((a, r) => a + r.score / Math.max(1, r.total), 0) / quizCount) * 100)
    : null;

  const pct = learnedCount / COUNTRIES.length;

  const regionStats = REGION_ORDER.map((r) => {
    const cs = COUNTRIES.filter((c) => c.region === r);
    const learned = cs.filter((c) => statOf(c.id).learned).length;
    return { r, total: cs.length, learned };
  });

  const sorted = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, "pl"));

  const statusOf = (id: string) => {
    const s = statOf(id);
    return s.learned ? "learned" : s.c + s.w > 0 ? "try" : "new";
  };

  return (
    <div className="space-y-5 animate-view">
      {/* -------- nagłówek postępu -------- */}
      <div className="grid lg:grid-cols-[auto_1fr] gap-5 items-stretch">
        <div className="panel p-6 flex flex-col items-center justify-center text-center min-w-[240px]">
          <Ring value={pct} color={pct >= 0.66 ? "#3ecf8e" : "#f6b94b"} size={150} stroke={13}>
            <div>
              <div className="font-display text-[32px] font-extrabold leading-none">
                {Math.round(pct * 100)}%
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#647d9e] mt-1">mapy Europy</div>
            </div>
          </Ring>
          <div className="mt-3 text-sm text-[#94aac6]">
            <span className="font-bold text-[#e9f2fb]">{learnedCount}</span> z{" "}
            <span className="font-bold text-[#e9f2fb]">{COUNTRIES.length}</span> państw opanowanych
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <Tile icon={<IconTrophy className="w-5 h-5" />} tone="green" value={`${learnedCount}`} label="opanowane" />
          <Tile icon={<IconQuiz className="w-5 h-5" />} tone="sky" value={`${quizCount}`} label="quizy i gry" />
          <Tile icon={<IconTarget className="w-5 h-5" />} tone="amber" value={avg === null ? "—" : `${avg}%`} label="średni wynik" />
          <Tile icon={<IconFlame className="w-5 h-5" />} tone="amber" value={`${store.bestStreak}`} label="najlepsza seria" />

          <div className="col-span-2 xl:col-span-4 panel p-4">
            <div className="lbl mb-3">Postęp według regionów</div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {regionStats.map(({ r, total, learned }) => (
                <div key={r}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">{REGIONS[r]}</span>
                    <span className="text-[#647d9e]">
                      {learned}/{total}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#0b1b30] border border-[#1e3554] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(learned / total) * 100}%`,
                        background:
                          learned === total
                            ? "linear-gradient(90deg,#2f9e77,#3ecf8e)"
                            : "linear-gradient(90deg,#c98f2c,#f6b94b)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* -------- wszystkie państwa -------- */}
      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          <div className="lbl">Wszystkie państwa — kliknij, by oznaczyć</div>
          <div className="ml-auto flex items-center gap-4 text-xs text-[#94aac6]">
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-[4px] bg-[#31517a] inline-block" /> nowe</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-[4px] bg-[#f6b94b] inline-block" /> w trakcie</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-[4px] bg-[#3ecf8e] inline-block" /> opanowane</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {sorted.map((c) => {
            const st = statusOf(c.id);
            const s = statOf(c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  const will = !s.learned;
                  toggleLearned(c.id);
                  toast(will ? `${c.name} — opanowane` : `${c.name} — wraca do nauki`, will ? "ok" : "info");
                }}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-all hover:-translate-y-px ${
                  st === "learned"
                    ? "border-[#3ecf8e]/35 bg-[#3ecf8e]/8"
                    : st === "try"
                    ? "border-[#f6b94b]/30 bg-[#f6b94b]/6"
                    : "border-[#1e3554] bg-[#0b1b30]/50 hover:border-[#31517a]"
                }`}
              >
                <span className="text-lg leading-none">{flag(c.iso2)}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold truncate">{c.name}</span>
                  <span className={`block text-[11px] truncate ${st === "learned" ? "text-[#3ecf8e]" : "text-[#647d9e]"}`}>
                    {c.capital}
                  </span>
                </span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    st === "learned" ? "bg-[#3ecf8e]" : st === "try" ? "bg-[#f6b94b]" : "bg-[#31517a]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* -------- historia -------- */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="panel p-5">
          <div className="lbl mb-3">Ostatnie quizy i gry</div>
          {store.history.length === 0 ? (
            <div className="text-sm text-[#647d9e] py-6 text-center">
              Jeszcze brak wyników. Zagraj w <span className="text-[#f6b94b] font-semibold">Quiz</span> lub{" "}
              <span className="text-[#f6b94b] font-semibold">Quiz na mapie</span> — wyniki pojawią się tutaj.
            </div>
          ) : (
            <div className="space-y-2">
              {store.history.slice(0, 8).map((r) => {
                const p = r.score / Math.max(1, r.total);
                const d = new Date(r.date);
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg bg-[#0b1b30]/60 border border-[#1e3554] px-3.5 py-2.5">
                    <span className={`chip pointer-events-none ${r.mode === "mapa" ? "" : "chip-on"}`}>
                      {r.mode === "mapa" ? <IconMap className="w-3.5 h-3.5" /> : <IconQuiz className="w-3.5 h-3.5" />}
                      {r.mode === "mapa" ? "na mapie" : "quiz"}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[#122440] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p * 100}%`,
                          background: p >= 0.7 ? "#3ecf8e" : p >= 0.5 ? "#f6b94b" : "#f26d6d",
                        }}
                      />
                    </div>
                    <span className="font-display font-bold text-sm w-12 text-right">
                      {r.score}/{r.total}
                    </span>
                    <span className="text-[11px] text-[#647d9e] w-24 text-right whitespace-nowrap">
                      {d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" })},{" "}
                      {d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="panel p-5">
          <div className="lbl mb-2">Licznik prób</div>
          <div className="font-display text-4xl font-extrabold">{attempts}</div>
          <p className="text-xs text-[#647d9e] mt-1.5 leading-relaxed">
            Tyle razy odpowiadałeś w quizach. Każda odpowiedź — dobra czy zła — buduje Twoją mapę w głowie.
          </p>
          <div className="h-px bg-[#1e3554] my-4" />
          <div className="lbl mb-2 text-[#f26d6d]">Niebezpieczna strefa</div>
          <button className="btn btn-coral w-full justify-center" onClick={() => setConfirmReset(true)}>
            <IconRefresh className="w-4 h-4" /> Wyzeruj cały postęp
          </button>
        </div>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Na pewno wyzerować?"
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
              Zostawiam
            </button>
            <button
              className="btn btn-coral"
              onClick={() => {
                reset();
                setConfirmReset(false);
                toast("Postęp wyzerowany — nowa przygoda!", "warn");
              }}
            >
              <IconRefresh className="w-4 h-4" /> Tak, zeroję
            </button>
          </>
        }
      >
        Znikną wszystkie opanowane państwa, wyniki quizów i rekord serii ({store.bestStreak}). Tej operacji
        nie można cofnąć.
      </Modal>
    </div>
  );
}

function Tile({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: "amber" | "green" | "sky";
}) {
  const tones: Record<string, string> = {
    amber: "text-[#f6b94b]",
    green: "text-[#3ecf8e]",
    sky: "text-[#58b4e8]",
  };
  return (
    <div className="panel p-4 flex flex-col justify-between min-h-[96px]">
      <span className={tones[tone]}>{icon}</span>
      <div className="mt-2">
        <div className="font-display text-[26px] font-extrabold leading-none">{value}</div>
        <div className="text-[10px] uppercase tracking-[0.14em] text-[#647d9e] mt-1">{label}</div>
      </div>
    </div>
  );
}
