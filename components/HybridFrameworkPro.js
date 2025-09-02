// components/HybridFrameworkPro.js
// HybridFrameworkPro — Journey/Lens toggle, Journey View default

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Moon, Sun, ZoomIn, ZoomOut, Search, Grid as GridIcon, Info, X, Eye, EyeOff, RefreshCcw,
  Route as RouteIcon, Rows as RowsIcon, Brain, Users, ShieldAlert, Gauge
} from "lucide-react";

/**
 * Hybrid AI Service Design — Interactive Map (Swiss-Modern, Tailwind, Dark Mode)
 * v3:
 *  - NEW Journey/Lens toggle (Journey is default)
 *  - Journey View: single horizontal timeline of moments by stage/column
 *  - Lens View: original 4-lane grid (Experience, AI/Data, Behaviour, Governance)
 *  - Left intro panel with Layer + DP filters, Import/Export JSON
 *  - No horizontal pan; vertical scroll + zoom only
 */

// ---- Sample data (used until you import your dataset) ----
const sampleData = {
  moments: [
    {
      id: "discover",
      title: "Discover",
      stage: "Awareness",
      column: 2,
      description:
        "Prospect encounters proposition via search/social/site. Trust and clarity are decisive.",
      experience: {
        personas: ["Commercial Manager", "Analyst", "Marketer"],
        jobsToBeDone: ["Understand what this offers", "See proof it works for my context"],
        momentsOfTruth: ["Value clarity", "Credible evidence", "Low friction"],
        artefacts: ["Landing page", "Explainer", "Proof points"],
      },
      ai: {
        signals: ["traffic source", "topic intent", "industry tags"],
        models: ["LLM content personalisation", "intent classification"],
        automations: ["content variant selection", "CTA sequencing"],
        risks: ["hallucination", "over-personalisation", "privacy"],
      },
      behaviour: {
        barriers: ["Cognitive load", "Skepticism"],
        nudges: ["Social proof", "Clear default path", "Progress feedback"],
        frameworks: ["EAST: Easy, Attractive, Social, Timely"],
        habit: "First click → follows a clear, low-effort path",
      },
      governance: {
        checks: ["Claim substantiation", "Privacy notice", "A/B ethics review"],
        metrics: ["CTR", "Qualified visits", "Time on task"],
      },
      layers: ["service", "experience", "value", "ai", "governance"],
      dpLevel: "tactical",
    },
    {
      id: "consider",
      title: "Consider",
      stage: "Evaluation",
      column: 4,
      description:
        "User evaluates fit and ROI; seeks comparators, demos, and risk assurances.",
      experience: {
        personas: ["Commercial Manager", "Procurement"],
        jobsToBeDone: ["See pricing and TCO", "Compare alternatives"],
        momentsOfTruth: ["Transparency", "Proof of value"],
        artefacts: ["Calculator", "Case studies", "Demo"],
      },
      ai: {
        signals: ["firmographics", "use-case tags"],
        models: ["recommendation", "propensity"],
        automations: ["dynamic demo scripts", "pricing guidance"],
        risks: ["bias", "spurious precision"],
      },
      behaviour: {
        barriers: ["Analysis paralysis", "Loss aversion"],
        nudges: ["Default bundle", "Anchoring", "Decoy option"],
        frameworks: ["COM-B: Capability, Opportunity, Motivation → Behaviour"],
        habit: "Saves a configured package and books a demo",
      },
      governance: {
        checks: ["Price fairness", "explainability note"],
        metrics: ["Demo requests", "Config saves", "Qualified pipeline"],
      },
      layers: ["service", "experience", "value", "ai", "governance"],
      dpLevel: "integrated",
    },
    {
      id: "onboard",
      title: "Onboard",
      stage: "Activation",
      column: 6,
      description:
        "Handover from sales to delivery; setup, roles, data access, and trust building.",
      experience: {
        personas: ["Project Lead", "Data Steward", "Operator"],
        jobsToBeDone: ["Get started fast", "Know who does what"],
        momentsOfTruth: ["Seamless setup", "Role clarity"],
        artefacts: ["Runbook", "RACI", "Kick-off deck"],
      },
      ai: {
        signals: ["data availability", "quality", "security posture"],
        models: ["data quality scoring", "baseline model"],
        automations: ["schema inference", "PII redaction"],
        risks: ["data leakage", "access creep"],
      },
      behaviour: {
        barriers: ["Change fatigue", "Tool switch cost"],
        nudges: ["Checklist by role", "Just-in-time tips"],
        frameworks: ["BJ Fogg: Prompt × Ability × Motivation"],
        habit: "Daily first-week usage with goal streak",
      },
      governance: {
        checks: ["DPIA", "Model card v0", "Access reviews"],
        metrics: ["TTFHW (time-to-first-hello-world)", "DAU/WAU", "Setup completion"],
      },
      layers: ["service", "systems", "ai", "governance"],
      dpLevel: "integrated",
    },
    {
      id: "use",
      title: "Use",
      stage: "Operation",
      column: 8,
      description:
        "Day-to-day decision support; assistance woven into core workflows.",
      experience: {
        personas: ["Analyst", "Operator", "Manager"],
        jobsToBeDone: ["Faster decisions", "Better outcomes"],
        momentsOfTruth: ["Latency", "Accuracy", "Clarity"],
        artefacts: ["In-flow UX", "Explain panel", "Feedback widget"],
      },
      ai: {
        signals: ["real-time telemetry", "feedback ratings"],
        models: ["retrieval-aug LLM", "forecasting"],
        automations: ["auto-classification", "smart routing"],
        risks: ["drift", "automation bias"],
      },
      behaviour: {
        barriers: ["Over-trust or under-trust"],
        nudges: ["Confidence bands", "Why-this answer", "One-tap feedback"],
        frameworks: ["Nudge: feedback & salience"],
        habit: "Checks model suggestions before acting",
      },
      governance: {
        checks: ["online monitoring", "drift alerts", "appeal path"],
        metrics: ["Task time", "Error rate", "Uplift vs. control"],
      },
      layers: ["experience", "systems", "ai", "governance", "value"],
      dpLevel: "tactical",
    },
    {
      id: "renew",
      title: "Renew/Scale",
      stage: "Value Realisation",
      column: 10,
      description:
        "Prove ROI, capture learnings, and scale to adjacent journeys and teams.",
      experience: {
        personas: ["Sponsor", "Finance", "Ops"],
        jobsToBeDone: ["Prove value", "Reduce risk to scale"],
        momentsOfTruth: ["Attribution", "Change readiness"],
        artefacts: ["Benefits case", "Playbook", "Training"],
      },
      ai: {
        signals: ["portfolio outcomes", "operational KPIs"],
        models: ["uplift modelling", "scenario planning"],
        automations: ["auto-reporting", "model registry promote"],
        risks: ["model sprawl", "governance debt"],
      },
      behaviour: {
        barriers: ["Local optimisation", "Siloed wins"],
        nudges: ["Recognition", "Community of Practice", "Champion network"],
        frameworks: ["Habit formation & identity"],
        habit: "Team shares patterns and reuses components",
      },
      governance: {
        checks: ["post-implementation review", "ethics audit", "controls testing"],
        metrics: ["ROI", "Adoption depth", "Incident rate"],
      },
      layers: ["service", "experience", "value", "ai", "governance"],
      dpLevel: "integrated",
    },
  ],
};

// ---- UI constants ----
const lanes = [
  { key: "experience", label: "Value & Experience", accent: "border-emerald-500" },
  { key: "ai", label: "AI & Data", accent: "border-sky-500" },
  { key: "behaviour", label: "Behavioural Adoption", accent: "border-amber-500" },
  { key: "governance", label: "Governance & Risk", accent: "border-rose-500" },
];

const LAYER_KEYS = ["service", "experience", "behaviour", "systems", "value", "ai", "governance"];
const STAGE_ORDER = ["Awareness", "Evaluation", "Activation", "Operation", "Value Realisation"];
const STAGE_COLORS = {
  Awareness: "bg-neutral-300 dark:bg-neutral-700",
  Evaluation: "bg-neutral-300 dark:bg-neutral-700",
  Activation: "bg-neutral-300 dark:bg-neutral-700",
  Operation: "bg-neutral-300 dark:bg-neutral-700",
  "Value Realisation": "bg-neutral-300 dark:bg-neutral-700",
};

// ---- Component ----
export default function HybridFrameworkPro() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false; // fallback: light
  });

  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  // NEW: Journey/Lens toggle (Journey by default)
  const [viewMode, setViewMode] = useState("journey"); // "journey" | "lens"

  // Lane visibility (used in Lens View)
  const [visibleLanes, setVisibleLanes] = useState({
    experience: true,
    ai: true,
    behaviour: true,
    governance: true,
  });

  // Filters
  const [query, setQuery] = useState("");
  const [leftOpen, setLeftOpen] = useState(true);
  const [layerVisible, setLayerVisible] = useState({
    service: true,
    experience: true,
    behaviour: true,
    systems: true,
    value: true,
    ai: true,
    governance: true,
  });
  const [dpFilter, setDpFilter] = useState("all"); // all | tactical | integrated

  // Data & details
  const fileInputRef = useRef(null);
  const [data, setData] = useState(sampleData);
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const containerRef = useRef(null);

  // Zoom with Ctrl/⌘ + wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z) => {
          const next = Math.min(2.5, Math.max(0.5, z * (e.deltaY > 0 ? 0.9 : 1.1)));
          return parseFloat(next.toFixed(2));
        });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Filtered moments (query + layers + dpLevel)
  const filteredMoments = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = (data?.moments || []).slice();

    if (dpFilter !== "all") arr = arr.filter((m) => (m.dpLevel || "tactical") === dpFilter);

    arr = arr.filter((m) => {
      const ls = Array.isArray(m.layers) ? m.layers : LAYER_KEYS;
      return ls.some((l) => layerVisible[l]);
    });

    if (q) {
      arr = arr.filter((m) => JSON.stringify(m).toLowerCase().includes(q));
    }

    // Sort by stage order then by column (left→right)
    arr.sort((a, b) => {
      const sA = STAGE_ORDER.indexOf(a.stage);
      const sB = STAGE_ORDER.indexOf(b.stage);
      if (sA !== sB) return sA - sB;
      return (a.column || 1) - (b.column || 1);
    });

    return arr;
  }, [query, data, layerVisible, dpFilter]);

  const selectedMoment = useMemo(
    () => (data?.moments || []).find((m) => m.id === selected) || null,
    [selected, data]
  );

  const resetView = () => setZoom(1);

  return (
    <div className={`${dark ? "dark" : ""} font-[Helvetica]`}>
      <div className="bg-white text-black dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-800 backdrop-blur bg-white/70 dark:bg-neutral-950/70">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-bold tracking-widest uppercase">
              Hybrid AI Service Design Map
            </h1>

            {/* View toggle */}
            <div className="ml-2 flex items-center gap-1 border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("journey")}
                className={`px-2 py-1.5 text-sm flex items-center gap-1 ${
                  viewMode === "journey"
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "bg-transparent text-neutral-700 dark:text-neutral-300"
                }`}
                title="Journey View"
              >
                <RouteIcon className="h-4 w-4" />
                Journey
              </button>
              <button
                onClick={() => setViewMode("lens")}
                className={`px-2 py-1.5 text-sm flex items-center gap-1 ${
                  viewMode === "lens"
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "bg-transparent text-neutral-700 dark:text-neutral-300"
                }`}
                title="Lens View"
              >
                <RowsIcon className="h-4 w-4" />
                Lenses
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="search"
                  placeholder="Search moments, signals, nudges…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>

              {/* Import/Export */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      const obj = JSON.parse(reader.result);
                      if (!obj || !Array.isArray(obj.moments))
                        throw new Error("Invalid JSON: expected { moments: [] }");
                      setData(obj);
                    } catch (err) {
                      alert("Import failed: " + err.message);
                    }
                  };
                  reader.readAsText(f);
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1.5 text-sm font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                title="Import JSON"
              >
                Import
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "hybrid-framework.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-2 py-1.5 text-sm font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                title="Export JSON"
              >
                Export
              </button>

              {/* Grid toggle */}
              <button
                onClick={() => setShowGrid((s) => !s)}
                className="px-2 py-1.5 text-sm font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-md flex items-center gap-1"
                title="Toggle grid backdrop"
              >
                <GridIcon className={`h-4 w-4 ${showGrid ? "" : "opacity-50"}`} />
                Grid
              </button>

              {/* Zoom controls */}
              <div className="hidden md:flex items-center gap-1 border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
                <button
                  onClick={() =>
                    setZoom((z) => Math.max(0.5, parseFloat((z - 0.1).toFixed(2))))
                  }
                  className="px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <div className="px-2 text-xs tabular-nums min-w-[3.5rem] text-center">
                  {(zoom * 100).toFixed(0)}%
                </div>
                <button
                  onClick={() =>
                    setZoom((z) => Math.min(2.5, parseFloat((z + 0.1).toFixed(2))))
                  }
                  className="px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={resetView}
                  className="px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800"
                  title="Reset view"
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Theme */}
              <button
                onClick={() => setDark((d) => !d)}
                className="px-2 py-1.5 text-sm font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-md flex items-center gap-1"
                title="Toggle dark mode"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {dark ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </header>

        {/* Left Intro Panel */}
        {leftOpen && (
          <LeftIntroPanel
            onClose={() => setLeftOpen(false)}
            layerVisible={layerVisible}
            setLayerVisible={setLayerVisible}
            dpFilter={dpFilter}
            setDpFilter={setDpFilter}
          />
        )}

        {/* Lane toggle chips (still handy for Lens View) */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
          <span className="uppercase tracking-widest text-xs text-neutral-500">
            {viewMode === "journey" ? "Journey" : "Lenses"}
          </span>
          {viewMode === "lens" &&
            lanes.map((ln) => (
              <button
                key={ln.key}
                onClick={() =>
                  setVisibleLanes((v) => ({ ...v, [ln.key]: !v[ln.key] }))
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                  visibleLanes[ln.key]
                    ? `bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100`
                    : `bg-transparent text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700`
                }`}
              >
                {visibleLanes[ln.key] ? <Eye className="inline h-3 w-3 mr-1" /> : <EyeOff className="inline h-3 w-3 mr-1" />}
                {ln.label}
              </button>
            ))}
        </div>

        {/* Canvas */}
  <div
    ref={containerRef}
    className={`relative h-[calc(100vh-56px)] border-t border-b border-neutral-200 dark:border-neutral-800 overflow-y-auto overflow-x-hidden ${
      leftOpen ? "pl-[560px]" : ""
    } ${
      showGrid
        ? "bg-[linear-gradient(to_right,rgba(127,127,127,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(127,127,127,0.08)_1px,transparent_1px)] bg-[size:80px_1px,1px_80px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
        : ""
    }`}
  >
          {/* Zoom ONLY the content, not the background */}
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
          <div className="relative w-[1600px] mx-20 mt-16 mb-0 pb-6">
              {/* content */}
              {viewMode === "journey" ? (
                <JourneyTrack
                  moments={filteredMoments}
                  onOpen={(id) => {
                    setSelected(id);
                    setPanelOpen(true);
                  }}
                />
              ) : (
                <LensGrid
                  lanes={lanes}
                  visibleLanes={visibleLanes}
                  moments={filteredMoments}
                  onOpen={(id) => {
                    setSelected(id);
                    setPanelOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        {false && (
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-6 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Experience
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-500" /> AI/Data
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Behaviour
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> Governance
          </div>
        </div>
        )}

        {/* Right Details Panel */}
        {panelOpen && selectedMoment && (
          <SidePanel onClose={() => setPanelOpen(false)} moment={selectedMoment} />
        )}

        {/* Footer */}
      {false && (
        <footer className="max-w-7xl mx-auto px-4 py-6 text-[11px] text-neutral-500 dark:text-neutral-400">
          Value, Experience, Behaviour, Systems, AI/Data, Governance — aligned.
        </footer>
      )}

      </div>
    </div>
  );
}

/* -------------------------
 * Journey View components
 * ------------------------- */

function JourneyTrack({ moments, onOpen }) {
  // group by stage
  const byStage = useMemo(() => {
    const map = new Map();
    STAGE_ORDER.forEach((s) => map.set(s, []));
    moments.forEach((m) => {
      if (!map.has(m.stage)) map.set(m.stage, []);
      map.get(m.stage).push(m);
    });
    // sort each stage's moments by column
    STAGE_ORDER.forEach((s) => {
      map.set(
        s,
        (map.get(s) || []).slice().sort((a, b) => (a.column || 1) - (b.column || 1))
      );
    });
    return map;
  }, [moments]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-12 gap-6 items-end">
        {STAGE_ORDER.map((stage, i) => (
          <div key={stage} className="col-span-12">
            {/* Stage header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-[2px] w-6 ${STAGE_COLORS[stage]} rounded`} />
              <div className="uppercase tracking-widest text-[11px] text-neutral-500">{stage}</div>
            </div>
            {/* Stage row */}
            <div className="grid grid-cols-12 gap-6">
              {(byStage.get(stage) || []).map((m) => (
                <JourneyCard key={m.id} moment={m} onOpen={onOpen} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JourneyCard({ moment, onOpen }) {
  // small lens indicators if that lens has content
  const has = {
    experience: !!moment.experience,
    ai: !!moment.ai,
    behaviour: !!moment.behaviour,
    governance: !!moment.governance,
  };
  const colStart = Math.min(12, Math.max(1, moment.column || 1));

  // Neutral card styling for Journey mode
  return (
    <div
      className="col-span-2 min-h-[90px] rounded-xl border border-neutral-300/70 dark:border-neutral-700/70 bg-white dark:bg-neutral-950/70 hover:shadow transition group cursor-pointer"
      style={{ gridColumnStart: colStart }}
      onClick={() => onOpen(moment.id)}
      title={`${moment.title} — ${moment.stage}`}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">
            {moment.stage}
          </span>
          <div className="flex items-center gap-1 opacity-80">
            {has.ai && <Brain className="h-3.5 w-3.5" />}
            {has.experience && <Users className="h-3.5 w-3.5" />}
            {has.behaviour && <Gauge className="h-3.5 w-3.5" />}
            {has.governance && <ShieldAlert className="h-3.5 w-3.5" />}
          </div>
        </div>
        <h3 className="mt-1 font-semibold text-sm leading-tight">{moment.title}</h3>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {moment.description}
        </p>
        <div className="mt-2 text-[10px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 flex items-center gap-1">
          <Info className="h-3 w-3" /> Details
        </div>
      </div>
    </div>
  );
}

/* -------------------------
 * Lens View (original) grid
 * ------------------------- */

function LensGrid({ lanes, visibleLanes, moments, onOpen }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {lanes.map((ln) => (
        <div key={ln.key} className="col-span-12">
          {visibleLanes[ln.key] && (
            <div
              className={`rounded-2xl border ${ln.accent} p-4 md:p-5 bg-white/70 dark:bg-neutral-900/60 shadow-sm`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="uppercase tracking-widest text-xs md:text-[11px] text-neutral-600 dark:text-neutral-400 font-bold">
                  {ln.label}
                </h2>
              </div>
              <div className="grid grid-cols-12 gap-6 mt-4">
                {moments.map((m) => (
                  <MomentCard key={ln.key + m.id} lane={ln.key} moment={m} onOpen={onOpen} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MomentCard({ lane, moment, onOpen }) {
  const laneColor =
    lane === "experience" ? "emerald" : lane === "ai" ? "sky" : lane === "behaviour" ? "amber" : "rose";
  const colStart = Math.min(12, Math.max(1, moment.column || 1));

  const summary = useMemo(() => {
    if (lane === "experience" && moment.experience?.momentsOfTruth) return moment.experience.momentsOfTruth.join(" • ");
    if (lane === "ai" && moment.ai?.models) return moment.ai.models.join(", ");
    if (lane === "behaviour" && moment.behaviour?.nudges) return moment.behaviour.nudges.join(", ");
    if (lane === "governance" && moment.governance?.checks) return moment.governance.checks.join(", ");
    return moment.description || "";
  }, [lane, moment]);

  return (
    <div
      className={`col-span-2 min-h-[90px] rounded-xl border border-${laneColor}-300/60 dark:border-${laneColor}-500/50 bg-white dark:bg-neutral-950/70 hover:shadow transition group cursor-pointer`}
      style={{ gridColumnStart: colStart }}
      data-role="card"
      onClick={() => onOpen(moment.id)}
      title={`${moment.title} — ${moment.stage}`}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className={`h-2 w-2 rounded-full bg-${laneColor}-500`} />
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">{moment.stage}</span>
        </div>
        <h3 className="mt-2 font-semibold text-sm leading-tight">{moment.title}</h3>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{summary}</p>
        <div className="mt-2 text-[10px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 flex items-center gap-1">
          <Info className="h-3 w-3" /> Details
        </div>
      </div>
    </div>
  );
}

/* -------------------------
 * Side panel & helpers
 * ------------------------- */

function LeftIntroPanel({ onClose, layerVisible, setLayerVisible, dpFilter, setDpFilter }) {
  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[480px] md:w-[560px] bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 z-40 shadow-xl">
      <div className="h-12 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="text-xs uppercase tracking-widest text-neutral-500">Overview & Filters</div>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900" title="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-3rem)] text-sm">
        <section>
          <h3 className="text-base font-semibold">What you’re seeing</h3>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            A value-led service map that unites Service/Experience/Behaviour/Systems with Business Value, AI & Data, and Governance.
            Import your blueprint/personas via the header controls, then explore.
          </p>
        </section>
        <section>
          <h4 className="uppercase tracking-widest text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-2">Layers</h4>
          <div className="grid grid-cols-2 gap-2">
            {LAYER_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-neutral-800"
                  checked={layerVisible[key]}
                  onChange={() => setLayerVisible((v) => ({ ...v, [key]: !v[key] }))}
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </section>
        <section>
          <h4 className="uppercase tracking-widest text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-2">
            Design Pattern Level
          </h4>
          <div className="flex items-center gap-3">
            {["all", "tactical", "integrated"].map((opt) => (
              <label key={opt} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="dp"
                  value={opt}
                  checked={dpFilter === opt}
                  onChange={() => setDpFilter(opt)}
                />
                <span className="capitalize">{opt}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-neutral-500">
            Switch between tactical, specific pain DPs and 2nd-level, integrated DPs.
          </p>
        </section>
        <section>
          <h4 className="uppercase tracking-widest text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-2">Tips</h4>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>Use Journey View for client storytelling; Lens View for internal completeness checks.</li>
            <li>Search filters across moments, signals, nudges, and more.</li>
            <li>Export/Import JSON to share or swap datasets (e.g., Marine vs. Theory).</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function SidePanel({ onClose, moment }) {
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[560px] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-40 shadow-xl">
      <div className="h-12 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="text-xs uppercase tracking-widest text-neutral-500">Moment Details</div>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900" title="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-3rem)]">
        <header>
          <div className="text-[10px] uppercase tracking-widest text-neutral-400">{moment.stage}</div>
          <h3 className="text-xl font-semibold mt-1">{moment.title}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{moment.description}</p>
        </header>

        {moment.experience && (
          <Section title="Value & Experience" dotClass="bg-emerald-500">
            {moment.experience.personas && <KeyVal k="Personas" v={moment.experience.personas.join(", ")} />}
            {moment.experience.jobsToBeDone && <KeyVal k="Jobs" v={moment.experience.jobsToBeDone.join("; ")} />}
            {moment.experience.momentsOfTruth && (
              <KeyVal k="Moments of Truth" v={moment.experience.momentsOfTruth.join(" • ")} />
            )}
            {moment.experience.artefacts && <KeyVal k="Artefacts" v={moment.experience.artefacts.join(", ")} />}
          </Section>
        )}

        {moment.ai && (
          <Section title="AI & Data" dotClass="bg-sky-500">
            {moment.ai.signals && <KeyVal k="Signals" v={moment.ai.signals.join(", ")} />}
            {moment.ai.models && <KeyVal k="Models" v={moment.ai.models.join(", ")} />}
            {moment.ai.automations && <KeyVal k="Automations" v={moment.ai.automations.join(", ")} />}
            {moment.ai.risks && <KeyVal k="Risks" v={moment.ai.risks.join(", ")} />}
          </Section>
        )}

        {moment.behaviour && (
          <Section title="Behavioural Adoption" dotClass="bg-amber-500">
            {moment.behaviour.barriers && <KeyVal k="Barriers" v={moment.behaviour.barriers.join(", ")} />}
            {moment.behaviour.nudges && <KeyVal k="Nudges" v={moment.behaviour.nudges.join(", ")} />}
            {moment.behaviour.frameworks && <KeyVal k="Frameworks" v={moment.behaviour.frameworks.join(", ")} />}
            {moment.behaviour.habit && <KeyVal k="Habit" v={moment.behaviour.habit} />}
          </Section>
        )}

        {moment.governance && (
          <Section title="Governance & Risk" dotClass="bg-rose-500">
            {moment.governance.checks && <KeyVal k="Checks" v={moment.governance.checks.join(", ")} />}
            {moment.governance.metrics && <KeyVal k="Metrics" v={moment.governance.metrics.join(", ")} />}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, dotClass, children }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-block h-2 w-2 rounded-full ${dotClass}`} />
        <h4 className="uppercase tracking-widest text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
          {title}
        </h4>
      </div>
      <div className="grid grid-cols-1 gap-1 text-sm text-neutral-700 dark:text-neutral-300">{children}</div>
    </section>
  );
}

function KeyVal({ k, v }) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-32 text-neutral-400 uppercase tracking-widest text-[10px]">{k}</div>
      <div className="text-neutral-700 dark:text-neutral-300">{v}</div>
    </div>
  );
}
