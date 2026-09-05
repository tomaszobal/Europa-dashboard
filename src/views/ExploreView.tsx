import { useMemo, useState } from "react";
import EuropeMap from "../components/EuropeMap";
import { COUNTRIES, byId, flag, REGION_FULL, type Region } from "../data/countries";
import { useStore, useToast } from "../lib/store";
import { IconCheck, IconEye, IconEyeOff, IconPin, IconSearch } from "../components/icons";
import { RegionPicker } from "../components/ui";

export default function ExploreView() {
  const { statOf, toggleLearned, learnedCount } = useStore();
  const toast = useToast();

  const [q, setQ] = useState("");
  const [region, setRegion] = useState<"all" | Region>("all");
  const [selId, setSelId] = useState<string | null>("616");
  const [showCapitals, setShowCapitals] = useState(false);
  const [hideCaps, setHideCaps] = useState(false);

  const filtered = useMemo(
    () =>
      COUNTRIES.filter(
        (c) =>
          (region === "all" || c.region === region) &&
          (c.name.toLowerCase().includes(q.toLowerCase()) ||
            c.capital.toLowerCase().includes(q.toLowerCase()))
      ).sort((a, b) => a.name.localeCompare(b.name, "pl")),
    [q, region]
  );

  const sel = selId ? byId[selId] : null;
  const selStat = selId ? statOf(selId) : null;

  const classFor = (id: string) => {
    const s = statOf(id);
    return s.learned ? "eu-learned" : s.c + s.w > 0 ? "eu-try" : "eu-new";
  };

  const tooltipFor = (id: string) => {
    if (id.startsWith("cap:")) {
      const c = byId[id.slice(4)];
      return c ? { title: c.capital, sub: `stolica · ${c.name}` } : null;
    }
    const c = byId[id];
    return c ? { title: `${flag(c.iso2)}  ${c.name}`, sub: `Stolica: ${c.capital}` } : null;
  };

  const toggle = () => {
    if (!sel) return;
    const nowLearned = !statOf(sel.id).learned;
    toggleLearned(sel.id);
    toast(
      nowLearned ? `${sel.name} — oznaczone jako opanowane` : `${sel.name} — wraca do nauki`,
      nowLearned ? "ok" : "info"
    );
  };

  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_350px] gap-5 items-start">
      {/* -------- mapa -------- */}
      <div className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
          <div className="flex items-center gap-4 text-xs text-[#94aac6]">
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-[4px] bg-[#2b4b72] inline-block" /> nowe
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-[4px] bg-[#4b7a9e] inline-block" /> w trakcie
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-[4px] bg-[#2f9e77] inline-block" /> opanowane
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className={`chip ${showCapitals ? "chip-on" : ""}`}
              onClick={() => setShowCapitals((v) => !v)}
            >
              <IconPin className="w-3.5 h-3.5" />
              Stolice na mapie
            </button>
          </div>
        </div>

        <EuropeMap
          classFor={classFor}
          tooltipFor={tooltipFor}
          onSelect={setSelId}
          selectedId={selId}
          showCapitals={showCapitals}
        />

        <div className="flex items-center justify-between mt-2 text-[11px] text-[#647d9e]">
          <span>Najedź na państwo, aby zobaczyć podpowiedź · kliknij, aby wybrać</span>
          <span className="font-semibold text-[#94aac6]">
            {learnedCount}/{COUNTRIES.length} opanowanych
          </span>
        </div>
      </div>

      {/* -------- panel boczny -------- */}
      <div className="flex flex-col gap-4">
        {sel && selStat && (
          <div className="panel p-5 animate-view">
            <div className="flex items-start gap-3.5">
              <span className="text-[34px] leading-none mt-0.5">{flag(sel.iso2)}</span>
              <div className="min-w-0">
                <h2 className="font-display text-[22px] font-extrabold leading-tight">{sel.name}</h2>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#647d9e] mt-1">
                  {REGION_FULL[sel.region]}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-[#0b1b30]/70 border border-[#1e3554] px-4 py-3">
              <div className="lbl">Stolica</div>
              <div className="font-display text-xl font-bold text-[#3ecf8e] mt-0.5">{sel.capital}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="rounded-lg bg-[#0b1b30]/70 border border-[#1e3554] py-2">
                <div className="font-display font-bold text-[15px] text-[#3ecf8e]">{selStat.c}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#647d9e]">dobre</div>
              </div>
              <div className="rounded-lg bg-[#0b1b30]/70 border border-[#1e3554] py-2">
                <div className="font-display font-bold text-[15px] text-[#f26d6d]">{selStat.w}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#647d9e]">pomyłki</div>
              </div>
              <div className="rounded-lg bg-[#0b1b30]/70 border border-[#1e3554] py-2">
                <div className="font-display font-bold text-[15px]">
                  {selStat.c + selStat.w > 0
                    ? Math.round((selStat.c / (selStat.c + selStat.w)) * 100) + "%"
                    : "—"}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#647d9e]">skuteczność</div>
              </div>
            </div>
            <button
              onClick={toggle}
              className={`w-full mt-4 btn justify-center ${selStat.learned ? "btn-green" : "btn-ghost"}`}
            >
              <IconCheck className="w-4 h-4" />
              {selStat.learned ? "Opanowane — kliknij, by cofnąć" : "Oznacz jako opanowane"}
            </button>
          </div>
        )}

        <div className="panel p-4">
          <div className="relative mb-3">
            <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#647d9e]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Szukaj państwa lub stolicy…"
              className="input pl-9"
            />
          </div>
          <RegionPicker value={region} onChange={setRegion} />

          <div className="flex items-center justify-between mt-3.5 mb-1.5">
            <div className="lbl">Państwa ({filtered.length})</div>
            <button
              className="chip"
              onClick={() => setHideCaps((v) => !v)}
              title={hideCaps ? "Pokaż stolice na liście" : "Ukryj stolice na liście"}
            >
              {hideCaps ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
              {hideCaps ? "pokaż stolice" : "ukryj stolice"}
            </button>
          </div>

          <div className="nice-scroll overflow-y-auto pr-1 -mr-1" style={{ maxHeight: 420 }}>
            {filtered.length === 0 && (
              <div className="text-sm text-[#647d9e] py-8 text-center">
                Brak wyników dla „{q}”.
              </div>
            )}
            {filtered.map((c) => {
              const s = statOf(c.id);
              const active = selId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelId(c.id)}
                  className={`row-item ${active ? "row-active" : ""}`}
                >
                  <span className="text-[17px] leading-none">{flag(c.iso2)}</span>
                  <span className="flex-1 text-left min-w-0">
                    <span className="block text-sm font-semibold truncate">{c.name}</span>
                    <span className="block text-xs text-[#647d9e] truncate">
                      {hideCaps ? "• • • • •" : c.capital}
                    </span>
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      s.learned ? "bg-[#3ecf8e]" : s.c + s.w > 0 ? "bg-[#f6b94b]" : "bg-[#31517a]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
