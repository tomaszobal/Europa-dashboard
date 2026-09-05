import React, { useMemo, useRef, useState } from "react";
import { geoAzimuthalEqualArea, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-50m.json";
import { INTERACTIVE_IDS } from "../data/countries";

const W = 1000;
const H = 760;

interface Shape {
  id: string;
  d: string;
  area: number;
  cx: number;
  cy: number;
}

interface Tip {
  x: number;
  y: number;
  title: string;
  sub?: string;
}

export type FxKind = "good" | "bad" | "reveal";
export type FxMap = Record<string, FxKind>;

interface Props {
  classFor: (id: string) => string;
  tooltipFor?: (id: string) => { title: string; sub?: string } | null;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
  showCapitals?: boolean;
  fx?: FxMap;
  fxKey?: number;
}

export default function EuropeMap({
  classFor,
  tooltipFor,
  onSelect,
  selectedId,
  showCapitals,
  fx,
  fxKey,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  const { contextPaths, shapes, sphere, grat } = useMemo(() => {
    const topo: any = world;
    const fc: any = feature(topo, topo.objects.countries);
    const proj = geoAzimuthalEqualArea().rotate([-13, -52]);
    const bounds: any = {
      type: "Polygon",
      coordinates: [[[-24, 34.5], [42, 34.5], [42, 71.2], [-24, 71.2], [-24, 34.5]]],
    };
    proj.fitExtent([[8, 8], [W - 8, H - 8]], bounds);
    const path = geoPath(proj);

    const sphere = path({ type: "Sphere" } as any) ?? "";
    const grat = path(geoGraticule10() as any) ?? "";

    const contextPaths: string[] = [];
    const shapes: Shape[] = [];

    for (const f of fc.features as any[]) {
      const id = String(f.id);
      const d = path(f as any) ?? "";
      if (!d) continue;
      if (!INTERACTIVE_IDS.has(id)) {
        contextPaths.push(d);
        continue;
      }
      let cx = 0;
      let cy = 0;
      const g: any = f.geometry;
      if (g.type === "MultiPolygon") {
        let best: any = null;
        let ba = -1;
        for (const poly of g.coordinates) {
          const tmp: any = {
            type: "Feature",
            geometry: { type: "Polygon", coordinates: poly },
            properties: {},
          };
          const a = Math.abs(path.area(tmp));
          if (a > ba) {
            ba = a;
            best = tmp;
          }
        }
        if (best) {
          const c = path.centroid(best);
          cx = c[0];
          cy = c[1];
        }
      } else {
        const c = path.centroid(f as any);
        cx = c[0];
        cy = c[1];
      }
      shapes.push({ id, d, area: Math.abs(path.area(f as any)), cx, cy });
    }
    return { contextPaths, shapes, sphere, grat };
  }, []);

  const moveTip = (e: React.PointerEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    setTip((t) => (t ? { ...t, x: e.clientX - r.left, y: e.clientY - r.top } : t));
  };

  const enter = (id: string) => (e: React.PointerEvent) => {
    const info = tooltipFor?.(id);
    if (!info) return;
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, ...info });
  };

  const leave = () => setTip(null);

  const micro = shapes.filter((s) => s.area < 140);

  return (
    <div ref={wrapRef} className="relative select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        onPointerMove={moveTip}
        onPointerLeave={leave}
      >
        <defs>
          <radialGradient id="seaGrad" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#12294a" />
            <stop offset="100%" stopColor="#0b1a31" />
          </radialGradient>
          <pattern id="seaDots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.3" cy="1.3" r="1.1" fill="#1d3a5e" />
          </pattern>
        </defs>

        <path d={sphere} fill="url(#seaGrad)" className="sea-outline" />
        <path d={sphere} fill="url(#seaDots)" opacity="0.55" pointerEvents="none" />
        <path d={grat} className="graticule" pointerEvents="none" />

        <g pointerEvents="none">
          {contextPaths.map((d, i) => (
            <path key={i} d={d} className="ctx" />
          ))}
        </g>

        <g>
          {shapes.map((s) => {
            const k = fx?.[s.id];
            return (
              <path
                key={k ? `${s.id}:${fxKey}` : s.id}
                d={s.d}
                className={`eu ${classFor(s.id)}${selectedId === s.id ? " eu-sel" : ""}${
                  k ? ` fx-${k}` : ""
                }`}
                onPointerEnter={enter(s.id)}
                onPointerLeave={leave}
                onClick={() => onSelect?.(s.id)}
              />
            );
          })}
        </g>

        {showCapitals && (
          <g>
            {shapes.filter((s) => s.cx >= 0 && s.cx <= W && s.cy >= 0 && s.cy <= H).map((s) => (
              <g
                key={"cap" + s.id}
                className="cap"
                onPointerEnter={enter("cap:" + s.id)}
                onPointerLeave={leave}
              >
                <circle cx={s.cx} cy={s.cy} r="3.4" />
                <circle cx={s.cx} cy={s.cy} r="9" className="hit" />
              </g>
            ))}
          </g>
        )}

        <g>
          {micro.map((s) => {
            const k = fx?.[s.id];
            return (
              <g
                key={k ? `m${s.id}:${fxKey}` : "m" + s.id}
                onPointerEnter={enter(s.id)}
                onPointerLeave={leave}
                onClick={() => onSelect?.(s.id)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={s.cx} cy={s.cy} r="11" className="mark-ring" />
                <circle
                  cx={s.cx}
                  cy={s.cy}
                  r="4"
                  className={`eu-dot ${classFor(s.id)}${k ? ` fx-${k}` : ""}`}
                />
              </g>
            );
          })}
        </g>

        <g pointerEvents="none" transform="translate(925 685)">
          <g className="compass-spin">
            <circle r="30" fill="none" stroke="#28496f" strokeWidth="1" strokeDasharray="2 4" />
            <path d="M0 -26 L5 0 L0 26 L-5 0 Z" fill="none" stroke="#3d6896" strokeWidth="1" />
            <path d="M-26 0 L0 5 L26 0 L0 -5 Z" fill="none" stroke="#3d6896" strokeWidth="1" />
            <path d="M0 -26 L5 0 L-5 0 Z" fill="#f6b94b" opacity="0.85" />
            <circle r="2.2" fill="#f6b94b" />
          </g>
        </g>
      </svg>

      {tip && (
        <div
          className="map-tip"
          style={{
            left: Math.max(8, Math.min(tip.x + 16, (wrapRef.current?.clientWidth ?? 600) - 170)),
            top: Math.max(8, tip.y + 14),
          }}
        >
          <div className="font-semibold text-[13px] leading-tight">{tip.title}</div>
          {tip.sub && <div className="text-[11px] opacity-75 mt-0.5">{tip.sub}</div>}
        </div>
      )}
    </div>
  );
}
