import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Dot,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = 'ONBOARDING' | 'INSTRUCTIONS' | 'WARMUP' | 'TRIAL' | 'RPE_CHECK' | 'RESULTS';

interface HRReading {
  elapsed: number; // seconds
  hr: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIAL_DURATION = 1800; // 30 min
const WARMUP_DURATION = 600; // 10 min
// HR prompts fire at these elapsed-second marks (every 5 min from 10-min mark onward)
const PROMPT_TIMES = [600, 900, 1200, 1500, 1800];

// ─── Zone math (anchored to measured LT HR) ───────────────────────────────────

const ZONE_DEFS = [
  { name: 'Z1', label: 'Easy',      desc: 'Recovery, long slow distance', pct: [0,    0.85], color: '#86efac' },
  { name: 'Z2', label: 'Aerobic',   desc: 'Aerobic base building',        pct: [0.85, 0.89], color: '#4ade80' },
  { name: 'Z3', label: 'Threshold', desc: 'Your LT pace — tempo runs',    pct: [0.90, 1.00], color: '#facc15' },
  { name: 'Z4', label: 'VO₂max',    desc: 'Hard intervals',               pct: [1.01, 1.06], color: '#fb923c' },
  { name: 'Z5', label: 'Max',       desc: 'All-out sprints',              pct: [1.07, 1.20], color: '#f87171' },
];

function getZones(ltHR: number) {
  return ZONE_DEFS.map(z => ({
    ...z,
    low:  Math.round(ltHR * z.pct[0]),
    high: Math.round(ltHR * z.pct[1]),
  }));
}

function computeLtHR(readings: HRReading[]): number {
  // Exclude the 10:00 (600s) reading — HR hasn't fully stabilised at phase transition yet.
  // Use only 15:00–30:00 readings; fall back to all readings if fewer than 2 qualify.
  const stable = readings.filter(r => r.elapsed > 600);
  const src = stable.length >= 2 ? stable : readings;
  return Math.round(src.reduce((s, r) => s + r.hr, 0) / src.length);
}

function ltReadings(readings: HRReading[]): HRReading[] {
  const stable = readings.filter(r => r.elapsed > 600);
  return stable.length >= 2 ? stable : readings;
}

function fmtTime(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function fmtElapsed(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function Btn({
  onClick, children, variant = 'primary', disabled = false, fullWidth = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  const base = `px-4 sm:px-6 py-3 rounded font-semibold text-base transition-opacity disabled:opacity-40 cursor-pointer${fullWidth ? ' w-full' : ''}`;
  const styles = {
    primary: `${base} bg-[#556B2F] text-white hover:bg-[#3A4B1C]`,
    ghost:   `${base} bg-transparent border border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10`,
  };
  return (
    <button className={styles[variant]} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ─── useCountdown (for warmup) ────────────────────────────────────────────────

function useCountdown(durationSeconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(true);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setRunning(false);
    if (ref.current) clearInterval(ref.current);
  }, []);

  useEffect(() => {
    setRemaining(durationSeconds);
    setRunning(true);
  }, [durationSeconds]);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(ref.current!);
          setRunning(false);
          onDone();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, onDone]);

  return { display: fmtTime(remaining), remaining, stop };
}

// ─── Screen: ONBOARDING ───────────────────────────────────────────────────────

function Onboarding({ onSubmit }: { onSubmit: (age: number) => void }) {
  const [age, setAge] = useState('');
  const valid = age !== '' && Number(age) >= 14 && Number(age) <= 100;

  return (
    <div className="flex flex-col items-center justify-center bg-[#fbfaf6] px-4 py-8 sm:py-12" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Lactate Threshold Test</h1>
        <p className="text-gray-500 mb-2 text-sm leading-relaxed">
          The 30-minute time trial — the gold standard no-blood LT test.
        </p>
        <p className="text-gray-400 mb-6 sm:mb-10 text-sm leading-relaxed">
          Run as hard as you can sustain for 30 minutes. Your average heart rate
          in the last 20 minutes = your lactate threshold HR.
        </p>

        <label className="block text-sm font-semibold text-gray-700 mb-1">Your age</label>
        <input
          type="number"
          min={14}
          max={100}
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="e.g. 32"
          className="w-full border border-gray-300 rounded px-4 py-3 text-lg mb-6 sm:mb-8 bg-white focus:outline-none focus:border-[#556B2F]"
        />

        <Btn onClick={() => onSubmit(Number(age))} disabled={!valid} fullWidth>
          Continue →
        </Btn>
      </div>
    </div>
  );
}

// ─── Screen: INSTRUCTIONS ─────────────────────────────────────────────────────

function Instructions({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  const items = [
    { icon: '🏃', text: 'Set treadmill to 1% incline — simulates outdoor running resistance' },
    { icon: '⚡', text: 'Run at 10K race effort for 30 minutes — hard but controlled, not a sprint' },
    { icon: '🐢', text: "Don't go out too fast. First 10 minutes is your building phase — settle into your pace" },
    { icon: '⌚', text: 'Every 5 minutes in the last 20 minutes, the app will prompt you to check your watch HR' },
    { icon: '📊', text: 'Average of those readings = your measured lactate threshold heart rate' },
  ];

  return (
    <div className="bg-[#fbfaf6] px-4 py-8 sm:py-12 flex flex-col items-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Before you start</h2>
        <p className="text-gray-500 text-sm mb-6 sm:mb-8">Make sure your heart rate watch is on and synced.</p>

        <div className="space-y-4 mb-8 sm:mb-10">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
              <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#556B2F]/10 border border-[#556B2F]/30 rounded p-4 mb-8">
          <p className="text-xs text-[#556B2F] font-semibold uppercase tracking-widest mb-1">Why this works</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            At lactate threshold, your body reaches steady-state lactate production. Heart rate stabilises
            in the last 20 minutes of an all-out 30-min effort — that stable HR is your LT.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Btn onClick={onStart}>Start warmup</Btn>
          <Btn onClick={onBack} variant="ghost">← Back</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: WARMUP ──────────────────────────────────────────────────────────

function Warmup({ onDone }: { onDone: () => void }) {
  const { display, stop } = useCountdown(WARMUP_DURATION, onDone);

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Warmup</p>
      <p className="text-gray-300 text-base sm:text-lg mb-2 text-center">Easy pace · 1% incline</p>
      <p className="text-gray-500 text-sm mb-8 sm:mb-10 text-center">Get your legs moving — don't push yet</p>
      <div className="font-mono text-7xl sm:text-8xl font-bold tabular-nums mb-10 sm:mb-12" style={{ fontSize: 'clamp(4rem, 20vw, 8rem)' }}>{display}</div>
      <button
        onClick={() => { stop(); onDone(); }}
        className="text-gray-500 underline text-sm cursor-pointer hover:text-gray-300"
      >
        Skip warmup
      </button>
    </div>
  );
}

// ─── HR prompt overlay (used during TRIAL) ────────────────────────────────────

function HRPrompt({
  elapsed, promptNumber, totalPrompts, onSubmit, onSkip,
}: {
  elapsed: number;
  promptNumber: number;
  totalPrompts: number;
  onSubmit: (hr: number) => void;
  onSkip: () => void;
}) {
  const [hr, setHr] = useState('');
  const valid = hr !== '' && Number(hr) >= 40 && Number(hr) <= 240;

  return (
    <div className="absolute inset-0 bg-gray-950/95 flex flex-col items-center justify-center px-4 z-10">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl p-6 shadow-2xl">
        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest mb-1">
          Reading {promptNumber} of {totalPrompts} · {fmtElapsed(elapsed)} elapsed
        </p>
        <h3 className="text-white text-xl font-bold mb-1">Check your watch</h3>
        <p className="text-gray-400 text-sm mb-5">What's your current heart rate?</p>

        <input
          type="number"
          min={40}
          max={240}
          value={hr}
          onChange={e => setHr(e.target.value)}
          placeholder="bpm"
          autoFocus
          className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-4 text-4xl font-mono text-center text-white mb-4 focus:outline-none focus:border-[#556B2F]"
        />

        <button
          onClick={() => onSubmit(Number(hr))}
          disabled={!valid}
          className="w-full py-4 bg-[#556B2F] text-white rounded font-bold disabled:opacity-40 cursor-pointer hover:bg-[#3A4B1C] transition-colors mb-3"
        >
          Log HR →
        </button>
        <button
          onClick={onSkip}
          className="w-full py-2 text-gray-500 text-sm cursor-pointer hover:text-gray-300"
        >
          Skip this reading
        </button>
      </div>
    </div>
  );
}

// ─── Screen: TRIAL ───────────────────────────────────────────────────────────

function Trial({
  onDone,
}: {
  onDone: (readings: HRReading[]) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [hrReadings, setHrReadings] = useState<HRReading[]>([]);
  const [promptIdx, setPromptIdx] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        if (next >= TRIAL_DURATION) {
          clearInterval(intervalRef.current!);
          return TRIAL_DURATION;
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Trigger prompts
  useEffect(() => {
    if (promptIdx >= PROMPT_TIMES.length) return;
    if (elapsed >= PROMPT_TIMES[promptIdx] && !showPrompt) {
      setShowPrompt(true);
    }
  }, [elapsed, promptIdx, showPrompt]);

  // Auto-advance to results when trial ends and no prompt pending
  useEffect(() => {
    if (elapsed >= TRIAL_DURATION && !showPrompt) {
      onDone(hrReadings);
    }
  }, [elapsed, showPrompt, hrReadings, onDone]);

  function handlePromptSubmit(hr: number) {
    const reading = { elapsed: PROMPT_TIMES[promptIdx], hr };
    const next = [...hrReadings, reading];
    setHrReadings(next);
    setShowPrompt(false);
    const nextIdx = promptIdx + 1;
    setPromptIdx(nextIdx);
    if (PROMPT_TIMES[promptIdx] >= TRIAL_DURATION) {
      onDone(next);
    }
  }

  function handlePromptSkip() {
    setShowPrompt(false);
    const nextIdx = promptIdx + 1;
    setPromptIdx(nextIdx);
    if (PROMPT_TIMES[promptIdx] >= TRIAL_DURATION) {
      onDone(hrReadings);
    }
  }

  const remaining = TRIAL_DURATION - elapsed;
  const pct = (elapsed / TRIAL_DURATION) * 100;
  const inThreshold = elapsed >= 600;
  const promptsDone = hrReadings.length;
  const promptsTotal = PROMPT_TIMES.length;

  return (
    <div className="relative bg-gray-900 text-white flex flex-col items-center justify-center px-4 overflow-hidden" style={{ minHeight: 'calc(100vh - 60px)' }}>
      {showPrompt && (
        <HRPrompt
          elapsed={elapsed}
          promptNumber={promptsDone + 1}
          totalPrompts={promptsTotal}
          onSubmit={handlePromptSubmit}
          onSkip={handlePromptSkip}
        />
      )}

      <div className="w-full max-w-sm">
        {/* Phase banner */}
        <div className={`text-center mb-6 transition-all duration-700 ${inThreshold ? 'text-yellow-400' : 'text-gray-400'}`}>
          <p className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
            {inThreshold ? '⚡ Threshold phase — hold your pace' : 'Building phase — settle in'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${inThreshold ? 'bg-yellow-400' : 'bg-gray-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mt-2">
            <span>0:00</span>
            <span className={inThreshold ? 'text-yellow-600' : ''}>10:00</span>
            <span>30:00</span>
          </div>
        </div>

        {/* Countdown */}
        <p className="text-gray-400 text-sm text-center mb-1">remaining</p>
        <div className="font-mono text-7xl sm:text-8xl font-bold tabular-nums text-center mb-8 sm:mb-10" style={{ fontSize: 'clamp(4rem, 24vw, 8rem)' }}>
          {fmtTime(remaining)}
        </div>

        {/* HR readings so far */}
        {hrReadings.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-3">HR readings so far</p>
            <div className="flex flex-wrap gap-2">
              {hrReadings.map((r, i) => (
                <span key={i} className="bg-gray-700 text-white text-xs sm:text-sm font-mono px-3 py-1 rounded">
                  {r.hr}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next prompt indicator */}
        {!showPrompt && promptIdx < PROMPT_TIMES.length && (
          <p className="text-gray-600 text-[10px] sm:text-xs text-center">
            Next HR check at {fmtElapsed(PROMPT_TIMES[promptIdx])}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Screen: RPE_CHECK ───────────────────────────────────────────────────────

const RPE_LABELS: Record<number, string> = {
  1: 'Nothing at all', 2: 'Very easy', 3: 'Easy', 4: 'Moderate',
  5: 'Somewhat hard', 6: 'Hard', 7: 'Very hard', 8: 'Very hard+',
  9: 'Extremely hard', 10: 'Maximal',
};

function RPECheck({ onSubmit }: { onSubmit: (rpe: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="w-full max-w-sm">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Done — one more question</p>
        <h2 className="text-2xl font-bold mb-1">How hard was that?</h2>
        <p className="text-gray-400 text-sm mb-6 sm:mb-8">
          Should be 8–9 for an accurate LT reading.
        </p>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button
              key={n}
              onClick={() => setSelected(n)}
              className={`py-3 sm:py-4 rounded text-base sm:text-lg font-bold transition-colors cursor-pointer ${
                selected === n
                  ? 'bg-[#556B2F] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="h-6 mb-6">
          {selected !== null && (
            <p className="text-gray-400 text-sm text-center">{RPE_LABELS[selected]}</p>
          )}
        </div>

        <button
          onClick={() => selected !== null && onSubmit(selected)}
          disabled={selected === null}
          className="w-full py-4 bg-[#556B2F] text-white rounded font-bold disabled:opacity-40 cursor-pointer hover:bg-[#3A4B1C] transition-colors"
        >
          See results →
        </button>
      </div>
    </div>
  );
}

// ─── Screen: RESULTS ─────────────────────────────────────────────────────────

function Results({
  readings, age, rpe, onRestart,
}: {
  readings: HRReading[];
  age: number;
  rpe: number;
  onRestart: () => void;
}) {
  const ltHR = computeLtHR(readings);
  const maxHR = 220 - age;
  const ltPct = Math.round((ltHR / maxHR) * 100);
  const zones = getZones(ltHR);
  const stableReadings = ltReadings(readings);
  const usedReadingCount = stableReadings.length;

  // RPE validity
  const rpeWarning = rpe <= 6
    ? { color: 'orange', msg: `RPE ${rpe}/10 suggests the effort may have been too easy. Your true LT HR is likely a few bpm higher than shown.` }
    : rpe === 10
      ? { color: 'orange', msg: `RPE 10/10 — maximum effort. Anaerobic contribution at this intensity can inflate HR slightly above true LT.` }
      : null;

  // Drift check over the stable (averaged) readings
  const stableHRs = stableReadings.map(r => r.hr);
  const hrSpread = stableHRs.length >= 2
    ? Math.max(...stableHRs) - Math.min(...stableHRs)
    : 0;
  const driftWarning = hrSpread > 10
    ? `Your HR rose ${hrSpread} bpm across the measured window (${Math.min(...stableHRs)}→${Math.max(...stableHRs)} bpm). This suggests cardiac drift or pacing out too hard early — your true LT may be closer to the lower readings.`
    : null;

  const chartData = readings.map(r => ({
    min: Math.round(r.elapsed / 60),
    hr: r.hr,
  }));

  const hrMin = Math.max(100, Math.min(...readings.map(r => r.hr)) - 10);
  const hrMax = Math.min(maxHR + 5, Math.max(...readings.map(r => r.hr)) + 10);

  return (
    <div className="bg-[#fbfaf6] px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Results</h2>
        <p className="text-gray-500 text-sm mb-6 sm:mb-8">
          Based on {readings.length} HR reading{readings.length !== 1 ? 's' : ''} from your 30-min trial
        </p>

        {/* LT callout */}
        <div className="bg-[#556B2F]/10 border border-[#556B2F]/30 rounded p-4 sm:p-5 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-[#556B2F] font-bold mb-1">
            Lactate Threshold HR
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-gray-900 mb-1">{ltHR} <span className="text-xl sm:text-2xl font-normal text-gray-500">bpm</span></p>
          <p className="text-xs sm:text-sm text-gray-500">
            {ltPct}% of est. max · avg of {usedReadingCount} readings
          </p>
        </div>

        {/* RPE validity warning */}
        {rpeWarning && (
          <div className="bg-orange-50 border border-orange-200 rounded p-4 mb-4 flex gap-3">
            <span className="text-orange-400 text-lg shrink-0">⚠</span>
            <p className="text-xs sm:text-sm text-orange-700">{rpeWarning.msg}</p>
          </div>
        )}

        {/* Drift warning */}
        {driftWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4 flex gap-3">
            <span className="text-yellow-500 text-lg shrink-0">↑</span>
            <p className="text-xs sm:text-sm text-yellow-800">{driftWarning}</p>
          </div>
        )}

        {/* HR progression chart */}
        <div className="bg-white rounded border border-gray-200 p-3 sm:p-4 mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm font-bold text-gray-700 mb-4">HR progression (last 20m)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="min"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[hrMin, hrMax]}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip formatter={(val: number) => [`${val} bpm`, 'HR']} />
              <ReferenceLine
                y={ltHR}
                stroke="#556B2F"
                strokeDasharray="4 4"
                label={{ value: `LT ${ltHR}`, fill: '#556B2F', fontSize: 10, position: 'right' }}
              />
              <Line
                type="monotone"
                dataKey="hr"
                stroke="#556B2F"
                strokeWidth={3}
                dot={<Dot r={5} fill="#556B2F" stroke="#fff" strokeWidth={2} />}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Training zones */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden mb-6 sm:mb-8">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs sm:text-sm font-bold text-gray-700">Training zones</p>
          </div>
          <table className="w-full text-xs sm:text-sm">
            <tbody>
              {zones.map((z, i) => (
                <tr key={z.name} className={i > 0 ? 'border-t border-gray-100' : ''}>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: z.color }}
                      />
                      <span className="font-bold text-gray-800">{z.name}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-normal">{z.label}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 font-mono text-gray-900 text-right">
                    {z.name === 'Z1'
                      ? `< ${z.high}`
                      : z.name === 'Z5'
                        ? `${z.low}+`
                        : `${z.low}–${z.high}`}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-[10px]">{z.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Raw readings */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden mb-8 sm:mb-10">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 sm:px-4 py-2 text-gray-500 font-bold uppercase text-[10px]">Time</th>
                <th className="text-left px-3 sm:px-4 py-2 text-gray-500 font-bold uppercase text-[10px]">HR</th>
                <th className="text-right px-3 sm:px-4 py-2 text-gray-500 font-bold uppercase text-[10px] hidden sm:table-cell">Δ avg</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => {
                const excluded = r.elapsed === 600;
                const delta = r.hr - ltHR;
                return (
                  <tr key={i} className={i > 0 ? 'border-t border-gray-100' : ''}>
                    <td className="px-3 sm:px-4 py-3 text-gray-500">
                      {fmtElapsed(r.elapsed)}
                      {excluded && <span className="ml-1 text-[9px] text-gray-300">excl.</span>}
                    </td>
                    <td className={`px-3 sm:px-4 py-3 font-mono ${excluded ? 'text-gray-300' : 'text-gray-900 font-bold'}`}>{r.hr} <span className="text-[10px] font-normal text-gray-400">bpm</span></td>
                    <td className="px-3 sm:px-4 py-3 text-right hidden sm:table-cell">
                      {excluded
                        ? null
                        : <span className={`text-[10px] font-mono font-bold ${delta > 0 ? 'text-red-500' : delta < 0 ? 'text-blue-500' : 'text-gray-400'}`}>
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          onClick={onRestart}
          className="text-sm text-[#556B2F] font-bold underline cursor-pointer hover:text-[#3A4B1C] block w-full text-center"
        >
          Run another test
        </button>
      </div>
    </div>
  );
}

// ─── Root orchestrator ────────────────────────────────────────────────────────

export default function LactateTest() {
  const [screen, setScreen] = useState<Screen>('ONBOARDING');
  const [age, setAge] = useState(0);
  const [readings, setReadings] = useState<HRReading[]>([]);
  const [rpe, setRpe] = useState(0);

  const handleTrialDone = useCallback((r: HRReading[]) => {
    setReadings(r);
    setScreen('RPE_CHECK');
  }, []);

  if (screen === 'ONBOARDING') return (
    <Onboarding onSubmit={a => { setAge(a); setScreen('INSTRUCTIONS'); }} />
  );

  if (screen === 'INSTRUCTIONS') return (
    <Instructions
      onStart={() => setScreen('WARMUP')}
      onBack={() => setScreen('ONBOARDING')}
    />
  );

  if (screen === 'WARMUP') return (
    <Warmup onDone={() => setScreen('TRIAL')} />
  );

  if (screen === 'TRIAL') return (
    <Trial onDone={handleTrialDone} />
  );

  if (screen === 'RPE_CHECK') return (
    <RPECheck onSubmit={r => { setRpe(r); setScreen('RESULTS'); }} />
  );

  if (screen === 'RESULTS') return (
    <Results
      readings={readings}
      age={age}
      rpe={rpe}
      onRestart={() => { setReadings([]); setRpe(0); setScreen('ONBOARDING'); }}
    />
  );

  return null;
}
