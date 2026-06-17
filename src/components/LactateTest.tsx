import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, ReferenceArea,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
type Screen = 'ONBOARDING' | 'PREVIEW' | 'WARMUP' | 'STAGE' | 'ENTRY' | 'RESULTS';

interface Stage {
  stage: number;
  speed: number;
  duration: number; // minutes
}

interface StageResult {
  stage: number;
  speed: number;
  hr: number;
  rpe: number;
}

// ─── Protocol ─────────────────────────────────────────────────────────────────

function generateProtocol(level: FitnessLevel): Stage[] {
  const configs = {
    beginner:     { start: 3.0, step: 0.5, stages: 6, duration: 4 },
    intermediate: { start: 4.5, step: 0.5, stages: 7, duration: 4 },
    advanced:     { start: 6.0, step: 0.5, stages: 8, duration: 4 },
  };
  const c = configs[level];
  return Array.from({ length: c.stages }, (_, i) => ({
    stage: i + 1,
    speed: +(c.start + i * c.step).toFixed(1),
    duration: c.duration,
  }));
}

// ─── Zone / LT math ───────────────────────────────────────────────────────────

const ZONE_DEFS = [
  { name: 'Z1', label: 'Easy',      desc: 'Recovery / easy aerobic', pct: [0,    0.60], color: '#86efac' },
  { name: 'Z2', label: 'Aerobic',   desc: 'Fat-burning base',        pct: [0.60, 0.70], color: '#4ade80' },
  { name: 'Z3', label: 'Threshold', desc: 'Lactate threshold range', pct: [0.70, 0.80], color: '#facc15' },
  { name: 'Z4', label: 'VO₂max',    desc: 'Hard intervals',          pct: [0.80, 0.90], color: '#fb923c' },
  { name: 'Z5', label: 'Max',       desc: 'All-out effort',          pct: [0.90, 1.00], color: '#f87171' },
];

function getZones(maxHR: number) {
  return ZONE_DEFS.map(z => ({
    ...z,
    low:  Math.round(maxHR * z.pct[0]),
    high: Math.round(maxHR * z.pct[1]),
  }));
}

function estimateLTIndex(results: StageResult[]): number {
  if (results.length < 2) return 0;
  let maxJump = -Infinity;
  let idx = results.length - 1;
  for (let i = 1; i < results.length; i++) {
    const jump = results[i].hr - results[i - 1].hr;
    if (jump > maxJump) { maxJump = jump; idx = i; }
  }
  return idx;
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function Btn({
  onClick, children, variant = 'primary', disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
}) {
  const base = 'px-6 py-3 rounded font-semibold text-base transition-opacity disabled:opacity-40 cursor-pointer';
  const styles = {
    primary: `${base} bg-[#556B2F] text-white hover:bg-[#3A4B1C]`,
    ghost:   `${base} bg-transparent border border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10`,
    danger:  `${base} bg-red-600 text-white hover:bg-red-700`,
  };
  return (
    <button className={styles[variant]} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>Stage {current} of {total}</span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#556B2F] transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Screen: ONBOARDING ───────────────────────────────────────────────────────

function Onboarding({ onSubmit }: { onSubmit: (age: number, level: FitnessLevel) => void }) {
  const [age, setAge] = useState('');
  const [level, setLevel] = useState<FitnessLevel | ''>('');

  const valid = age !== '' && Number(age) >= 10 && Number(age) <= 100 && level !== '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfaf6] px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lactate Threshold Test</h1>
        <p className="text-gray-500 mb-10 text-sm leading-relaxed">
          A treadmill step test to estimate your aerobic ceiling and training zones — no blood draw required.
          Heart rate and RPE at each stage do the work.
        </p>

        <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
        <input
          type="number"
          min={10}
          max={100}
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="e.g. 32"
          className="w-full border border-gray-300 rounded px-4 py-3 text-lg mb-8 bg-white focus:outline-none focus:border-[#556B2F]"
        />

        <label className="block text-sm font-semibold text-gray-700 mb-3">Fitness level</label>
        <div className="grid grid-cols-3 gap-3 mb-10">
          {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`py-3 px-2 rounded border text-sm font-medium capitalize transition-all cursor-pointer ${
                level === l
                  ? 'bg-[#556B2F] text-white border-[#556B2F]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#556B2F]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400 mb-6 leading-relaxed">
          <strong>Beginner:</strong> runs occasionally, &lt;5K base<br />
          <strong>Intermediate:</strong> consistent runner, 5K–10K trained<br />
          <strong>Advanced:</strong> regular training, half marathon or beyond
        </div>

        <Btn onClick={() => onSubmit(Number(age), level as FitnessLevel)} disabled={!valid}>
          Generate protocol →
        </Btn>
      </div>
    </div>
  );
}

// ─── Screen: PREVIEW ─────────────────────────────────────────────────────────

function Preview({
  protocol, onStart, onBack,
}: {
  protocol: Stage[];
  onStart: () => void;
  onBack: () => void;
}) {
  const totalMin = 5 + protocol.reduce((s, p) => s + p.duration, 0);

  return (
    <div className="min-h-screen bg-[#fbfaf6] px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Your protocol</h2>
        <p className="text-gray-500 text-sm mb-6">
          {protocol.length} stages · {totalMin} min total (incl. 5 min warmup) · 1% incline
        </p>

        <div className="overflow-hidden rounded border border-gray-200 mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">#</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Speed</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-400 italic" colSpan={3}>Warmup — 2.5 mph · 5 min</td>
              </tr>
              {protocol.map(s => (
                <tr key={s.stage} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-700">{s.stage}</td>
                  <td className="px-4 py-3 text-gray-700">{s.speed} mph</td>
                  <td className="px-4 py-3 text-gray-500">{s.duration} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          At the end of each stage you'll enter your heart rate (from your watch) and RPE.
          Keep the treadmill at 1% incline throughout.
        </p>

        <div className="flex gap-3">
          <Btn onClick={onBack} variant="ghost">← Back</Btn>
          <Btn onClick={onStart}>Start warmup</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Timer hook ───────────────────────────────────────────────────────────────

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

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return { display: `${mm}:${ss}`, remaining, stop };
}

// ─── Screen: WARMUP ──────────────────────────────────────────────────────────

function Warmup({ onDone }: { onDone: () => void }) {
  const { display, stop } = useCountdown(5 * 60, onDone);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Warmup</p>
      <p className="text-xl text-gray-300 mb-6">Set treadmill to 2.5 mph · 1% incline</p>
      <div className="font-mono text-8xl font-bold tabular-nums mb-10">{display}</div>
      <div className="flex gap-4">
        <button
          onClick={() => { stop(); onDone(); }}
          className="text-gray-500 underline text-sm cursor-pointer hover:text-gray-300"
        >
          Skip warmup
        </button>
      </div>
    </div>
  );
}

// ─── Screen: STAGE ───────────────────────────────────────────────────────────

function ActiveStage({
  stage, totalStages, onDone,
}: {
  stage: Stage;
  totalStages: number;
  onDone: () => void;
}) {
  const durationSec = stage.duration * 60;
  const { display, remaining, stop } = useCountdown(durationSec, onDone);
  const pct = ((durationSec - remaining) / durationSec) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            Stage {stage.stage} of {totalStages}
          </p>
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#556B2F] transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-2">Set treadmill to</p>
        <p className="text-6xl font-bold mb-1">{stage.speed}</p>
        <p className="text-gray-400 text-xl mb-12">mph · 1% incline</p>

        <div className="font-mono text-8xl font-bold tabular-nums text-center mb-12">{display}</div>

        <button
          onClick={() => { stop(); onDone(); }}
          className="w-full py-4 border border-gray-600 text-gray-400 rounded text-sm hover:border-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          End stage early
        </button>
      </div>
    </div>
  );
}

// ─── Screen: ENTRY ───────────────────────────────────────────────────────────

function StageEntry({
  stage, totalStages, onSubmit,
}: {
  stage: Stage;
  totalStages: number;
  onSubmit: (hr: number, rpe: number) => void;
}) {
  const [hr, setHr] = useState('');
  const [rpe, setRpe] = useState<number | null>(null);

  const valid = hr !== '' && Number(hr) >= 40 && Number(hr) <= 240 && rpe !== null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
          Stage {stage.stage} of {totalStages} complete · {stage.speed} mph
        </p>
        <h2 className="text-2xl font-bold mb-8">Log your data</h2>

        <label className="block text-sm text-gray-400 mb-2">Heart rate (bpm)</label>
        <input
          type="number"
          min={40}
          max={240}
          value={hr}
          onChange={e => setHr(e.target.value)}
          placeholder="e.g. 152"
          className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-4 text-4xl font-mono text-center mb-8 focus:outline-none focus:border-[#556B2F] text-white"
        />

        <label className="block text-sm text-gray-400 mb-3">
          RPE — Rate of perceived exertion
        </label>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <button
              key={n}
              onClick={() => setRpe(n)}
              className={`py-3 rounded text-lg font-bold transition-all cursor-pointer ${
                rpe === n
                  ? 'bg-[#556B2F] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-10">
          <span>Very easy</span>
          <span>Maximal</span>
        </div>

        <button
          onClick={() => onSubmit(Number(hr), rpe!)}
          disabled={!valid}
          className="w-full py-4 bg-[#556B2F] text-white rounded font-semibold text-lg disabled:opacity-40 cursor-pointer hover:bg-[#3A4B1C] transition-colors"
        >
          {stage.stage < totalStages ? `Next stage →` : 'See results →'}
        </button>
      </div>
    </div>
  );
}

// ─── Screen: RESULTS ─────────────────────────────────────────────────────────

function Results({
  results, age, onRestart,
}: {
  results: StageResult[];
  age: number;
  onRestart: () => void;
}) {
  const maxHR = 220 - age;
  const zones = getZones(maxHR);
  const ltIdx = estimateLTIndex(results);
  const ltResult = results[ltIdx];

  const chartData = results.map(r => ({
    speed: r.speed,
    hr: r.hr,
    rpe: r.rpe,
  }));

  const hrMin = Math.max(40, Math.min(...results.map(r => r.hr)) - 10);
  const hrMax = Math.min(maxHR + 5, Math.max(...results.map(r => r.hr)) + 15);

  return (
    <div className="min-h-screen bg-[#fbfaf6] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Results</h2>
        <p className="text-gray-500 text-sm mb-8">
          Estimated max HR: {maxHR} bpm (age {age})
        </p>

        {/* LT callout */}
        <div className="bg-[#556B2F]/10 border border-[#556B2F]/30 rounded p-5 mb-8">
          <p className="text-xs uppercase tracking-widest text-[#556B2F] font-semibold mb-1">
            Estimated Lactate Threshold
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {ltResult.speed} mph · {ltResult.hr} bpm
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Biggest HR jump between stages {ltIdx} → {ltIdx + 1}
          </p>
        </div>

        {/* HR curve chart */}
        <div className="bg-white rounded border border-gray-200 p-4 mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">Heart rate vs. speed</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="speed"
                label={{ value: 'Speed (mph)', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 12 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[hrMin, hrMax]}
                label={{ value: 'HR (bpm)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(val: number, name: string) => [
                  name === 'hr' ? `${val} bpm` : val,
                  name === 'hr' ? 'Heart Rate' : 'RPE',
                ]}
              />
              {/* Zone shading bands */}
              {zones.map(z => (
                z.low <= hrMax && z.high >= hrMin && (
                  <ReferenceArea
                    key={z.name}
                    y1={Math.max(z.low, hrMin)}
                    y2={Math.min(z.high, hrMax)}
                    fill={z.color}
                    fillOpacity={0.12}
                  />
                )
              ))}
              {/* Zone boundary lines */}
              {zones.slice(1).map(z => (
                z.low >= hrMin && z.low <= hrMax && (
                  <ReferenceLine
                    key={`line-${z.name}`}
                    y={z.low}
                    stroke={z.color}
                    strokeDasharray="3 3"
                    strokeOpacity={0.6}
                  />
                )
              ))}
              {/* LT marker */}
              <ReferenceLine
                x={ltResult.speed}
                stroke="#dc2626"
                strokeDasharray="4 4"
                label={{ value: 'LT', fill: '#dc2626', fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="hr"
                stroke="#556B2F"
                strokeWidth={2.5}
                dot={{ fill: '#556B2F', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Training zones table */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Zone</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">BPM range</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium hidden sm:table-cell">Description</th>
              </tr>
            </thead>
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
                    {z.low === 0 ? `< ${z.high}` : z.high >= maxHR ? `${z.low}+` : `${z.low}–${z.high}`}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{z.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stage-by-stage summary */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">#</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Speed</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">HR</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">RPE</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr
                  key={r.stage}
                  className={`${i > 0 ? 'border-t border-gray-100' : ''} ${i === ltIdx ? 'bg-red-50' : ''}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {r.stage}
                    {i === ltIdx && (
                      <span className="ml-2 text-xs text-red-500 font-normal">← LT</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.speed} mph</td>
                  <td className="px-4 py-3 font-mono text-gray-700">{r.hr} bpm</td>
                  <td className="px-4 py-3 text-gray-500">{r.rpe}/10</td>
                </tr>
              ))}
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
  const [protocol, setProtocol] = useState<Stage[]>([]);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [results, setResults] = useState<StageResult[]>([]);

  function handleOnboarding(a: number, level: FitnessLevel) {
    setAge(a);
    setProtocol(generateProtocol(level));
    setResults([]);
    setCurrentStageIdx(0);
    setScreen('PREVIEW');
  }

  function handleStartTest() {
    setScreen('WARMUP');
  }

  function handleWarmupDone() {
    setCurrentStageIdx(0);
    setScreen('STAGE');
  }

  const handleStageDone = useCallback(() => {
    setScreen('ENTRY');
  }, []);

  function handleEntrySubmit(hr: number, rpe: number) {
    const stage = protocol[currentStageIdx];
    const newResults = [...results, { stage: stage.stage, speed: stage.speed, hr, rpe }];
    setResults(newResults);

    if (currentStageIdx + 1 >= protocol.length) {
      setScreen('RESULTS');
    } else {
      setCurrentStageIdx(i => i + 1);
      setScreen('STAGE');
    }
  }

  function handleRestart() {
    setScreen('ONBOARDING');
  }

  if (screen === 'ONBOARDING') return <Onboarding onSubmit={handleOnboarding} />;

  if (screen === 'PREVIEW') return (
    <Preview
      protocol={protocol}
      onStart={handleStartTest}
      onBack={() => setScreen('ONBOARDING')}
    />
  );

  if (screen === 'WARMUP') return <Warmup onDone={handleWarmupDone} />;

  if (screen === 'STAGE') return (
    <ActiveStage
      stage={protocol[currentStageIdx]}
      totalStages={protocol.length}
      onDone={handleStageDone}
    />
  );

  if (screen === 'ENTRY') return (
    <StageEntry
      stage={protocol[currentStageIdx]}
      totalStages={protocol.length}
      onSubmit={handleEntrySubmit}
    />
  );

  if (screen === 'RESULTS') return (
    <Results results={results} age={age} onRestart={handleRestart} />
  );

  return null;
}
