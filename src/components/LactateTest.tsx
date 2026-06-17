import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Dot,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = 'ONBOARDING' | 'INSTRUCTIONS' | 'WARMUP' | 'TRIAL' | 'RESULTS';

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
  return Math.round(readings.reduce((s, r) => s + r.hr, 0) / readings.length);
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
  onClick, children, variant = 'primary', disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
}) {
  const base = 'px-6 py-3 rounded font-semibold text-base transition-opacity disabled:opacity-40 cursor-pointer';
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfaf6] px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lactate Threshold Test</h1>
        <p className="text-gray-500 mb-2 text-sm leading-relaxed">
          The 30-minute time trial — the gold standard no-blood LT test.
        </p>
        <p className="text-gray-400 mb-10 text-sm leading-relaxed">
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
          className="w-full border border-gray-300 rounded px-4 py-3 text-lg mb-8 bg-white focus:outline-none focus:border-[#556B2F]"
        />

        <Btn onClick={() => onSubmit(Number(age))} disabled={!valid}>
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
    <div className="min-h-screen bg-[#fbfaf6] px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Before you start</h2>
        <p className="text-gray-500 text-sm mb-8">Make sure your heart rate watch is on and synced.</p>

        <div className="space-y-4 mb-10">
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
            More accurate than a step test because you set your own pace.
          </p>
        </div>

        <div className="flex gap-3">
          <Btn onClick={onBack} variant="ghost">← Back</Btn>
          <Btn onClick={onStart}>Start warmup</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: WARMUP ──────────────────────────────────────────────────────────

function Warmup({ onDone }: { onDone: () => void }) {
  const { display, stop } = useCountdown(WARMUP_DURATION, onDone);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Warmup</p>
      <p className="text-gray-300 text-lg mb-2">Easy pace · 1% incline</p>
      <p className="text-gray-500 text-sm mb-10">Get your legs moving — don't push yet</p>
      <div className="font-mono text-8xl font-bold tabular-nums mb-12">{display}</div>
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
    <div className="absolute inset-0 bg-gray-950/90 flex flex-col items-center justify-center px-4 z-10">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
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
          className="w-full py-3 bg-[#556B2F] text-white rounded font-semibold disabled:opacity-40 cursor-pointer hover:bg-[#3A4B1C] transition-colors mb-3"
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
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
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
          <p className="text-xs uppercase tracking-widest font-semibold">
            {inThreshold ? '⚡ Threshold phase — hold your pace' : 'Building phase — settle in'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${inThreshold ? 'bg-yellow-400' : 'bg-gray-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0:00</span>
            <span>10:00</span>
            <span>30:00</span>
          </div>
        </div>

        {/* Countdown */}
        <p className="text-gray-400 text-sm text-center mb-1">remaining</p>
        <div className="font-mono text-8xl font-bold tabular-nums text-center mb-10">
          {fmtTime(remaining)}
        </div>

        {/* HR readings so far */}
        {hrReadings.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">HR readings so far</p>
            <div className="flex flex-wrap gap-2">
              {hrReadings.map((r, i) => (
                <span key={i} className="bg-gray-700 text-white text-sm font-mono px-3 py-1 rounded">
                  {r.hr} bpm
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next prompt indicator */}
        {!showPrompt && promptIdx < PROMPT_TIMES.length && (
          <p className="text-gray-600 text-xs text-center">
            Next HR check at {fmtElapsed(PROMPT_TIMES[promptIdx])}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Screen: RESULTS ─────────────────────────────────────────────────────────

function Results({
  readings, age, onRestart,
}: {
  readings: HRReading[];
  age: number;
  onRestart: () => void;
}) {
  const ltHR = computeLtHR(readings);
  const maxHR = 220 - age;
  const ltPct = Math.round((ltHR / maxHR) * 100);
  const zones = getZones(ltHR);

  const chartData = readings.map(r => ({
    min: Math.round(r.elapsed / 60),
    hr: r.hr,
  }));

  const hrMin = Math.max(100, Math.min(...readings.map(r => r.hr)) - 10);
  const hrMax = Math.min(maxHR + 5, Math.max(...readings.map(r => r.hr)) + 10);

  return (
    <div className="min-h-screen bg-[#fbfaf6] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Results</h2>
        <p className="text-gray-500 text-sm mb-8">
          Based on {readings.length} HR reading{readings.length !== 1 ? 's' : ''} from your 30-min trial
        </p>

        {/* LT callout */}
        <div className="bg-[#556B2F]/10 border border-[#556B2F]/30 rounded p-5 mb-8">
          <p className="text-xs uppercase tracking-widest text-[#556B2F] font-semibold mb-1">
            Lactate Threshold Heart Rate
          </p>
          <p className="text-5xl font-bold text-gray-900 mb-1">{ltHR} <span className="text-2xl font-normal text-gray-500">bpm</span></p>
          <p className="text-sm text-gray-500">
            {ltPct}% of estimated max HR ({maxHR} bpm) · average of {readings.length} readings
          </p>
        </div>

        {/* HR progression chart */}
        <div className="bg-white rounded border border-gray-200 p-4 mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">HR during last 20 minutes</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="min"
                label={{ value: 'Elapsed (min)', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 12 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[hrMin, hrMax]}
                label={{ value: 'HR (bpm)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(val: number) => [`${val} bpm`, 'Heart Rate']} />
              <ReferenceLine
                y={ltHR}
                stroke="#556B2F"
                strokeDasharray="4 4"
                label={{ value: `LT avg ${ltHR}`, fill: '#556B2F', fontSize: 11, position: 'right' }}
              />
              <Line
                type="monotone"
                dataKey="hr"
                stroke="#556B2F"
                strokeWidth={2}
                dot={<Dot r={6} fill="#556B2F" stroke="#fff" strokeWidth={2} />}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Training zones */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden mb-8">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Training zones</p>
            <p className="text-xs text-gray-400">Anchored to your measured LT HR of {ltHR} bpm</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {zones.map((z, i) => (
                <tr key={z.name} className={i > 0 ? 'border-t border-gray-100' : ''}>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ background: z.color }}
                    />
                    <span className="font-medium text-gray-800">{z.name} — {z.label}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">
                    {z.name === 'Z1'
                      ? `< ${z.high}`
                      : z.name === 'Z5'
                        ? `${z.low}+`
                        : `${z.low}–${z.high}`}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell text-xs">{z.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Raw readings */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Time</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">HR</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium hidden sm:table-cell">Δ from avg</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => {
                const delta = r.hr - ltHR;
                return (
                  <tr key={i} className={i > 0 ? 'border-t border-gray-100' : ''}>
                    <td className="px-4 py-3 text-gray-500">{fmtElapsed(r.elapsed)}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{r.hr} bpm</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-mono ${delta > 0 ? 'text-red-400' : delta < 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="px-4 py-3 text-gray-700 font-semibold">Average</td>
                <td className="px-4 py-3 font-mono font-bold text-gray-900">{ltHR} bpm</td>
                <td className="px-4 py-3 hidden sm:table-cell" />
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={onRestart}
          className="text-sm text-[#556B2F] underline cursor-pointer hover:text-[#3A4B1C]"
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

  const handleTrialDone = useCallback((r: HRReading[]) => {
    setReadings(r);
    setScreen('RESULTS');
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

  if (screen === 'RESULTS') return (
    <Results
      readings={readings}
      age={age}
      onRestart={() => { setReadings([]); setScreen('ONBOARDING'); }}
    />
  );

  return null;
}
