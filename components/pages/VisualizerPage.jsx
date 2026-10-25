'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  Code2,
  Cpu,
  Database,
  Layers3,
  Lightbulb,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { SectionHeading, MiniTag } from '../ui';

const PIPELINE = [
  {
    title: 'Create examples',
    subtitle: 'Dataset',
    detail:
      'You supply correct question and answer pairs. This is the practice material the model will learn from.',
    icon: Database,
  },
  {
    title: 'Convert to tokens',
    subtitle: 'Tokenizer',
    detail:
      'The tokenizer converts chat messages into numbers, including the special role boundaries Qwen expects.',
    icon: Code2,
  },
  {
    title: 'Load Qwen 0.6B',
    subtitle: 'Frozen base',
    detail:
      'The already-trained Qwen model provides broad language knowledge. Its original weights stay fixed during LoRA training.',
    icon: LockKeyhole,
  },
  {
    title: 'Attach LoRA',
    subtitle: 'Trainable adapter',
    detail:
      'Small trainable weight matrices are attached to selected layers. These are the parameters that will actually change.',
    icon: Layers3,
  },
  {
    title: 'Calculate loss',
    subtitle: 'Feedback',
    detail:
      'The model predicts tokens, compares them with the example answers, and calculates an error signal called loss.',
    icon: Activity,
  },
  {
    title: 'Update adapter',
    subtitle: 'Learning',
    detail:
      'The optimiser uses gradients to adjust only the LoRA adapter. Training repeats this process over many updates.',
    icon: Zap,
  },
  {
    title: 'Evaluate unseen prompts',
    subtitle: 'Test',
    detail:
      'Compare identical held-out questions before and after fine tuning. Check both structure and meaning accuracy.',
    icon: ShieldCheck,
  },
];

function VisualizerPage() {
  const [tab, setTab] = useState('pipeline');
  return (
    <>
      <SectionHeading
        eyebrow="EXPLORE THE INNER WORKINGS"
        title="Make the invisible visible."
        description="Interactive explanations for the parts of fine tuning that are difficult to understand from text alone."
      />
      <div className="segment-tabs">
        {[
          { id: 'pipeline', name: 'Training pipeline', icon: Layers3 },
          { id: 'lora', name: 'LoRA explained', icon: Cpu },
          { id: 'memory', name: 'Memory explorer', icon: SlidersHorizontal },
          { id: 'loss', name: 'Loss simulator', icon: Activity },
        ].map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={tab === id ? 'active' : ''}
          >
            <Icon size={17} />
            {name}
          </button>
        ))}
      </div>
      {tab === 'pipeline' && <PipelineDemo />}
      {tab === 'lora' && <LoraDemo />}
      {tab === 'memory' && <MemoryDemo />}
      {tab === 'loss' && <LossDemo />}
    </>
  );
}

function PipelineDemo() {
  const [step, setStep] = useState(0);
  const Current = PIPELINE[step].icon;
  return (
    <div className="visual-card">
      <div className="visual-head">
        <div>
          <div className="eyebrow">INTERACTIVE DIAGRAM / 01</div>
          <h2>How a model learns from examples</h2>
          <p>Tap each stage to see what happens to the data and weights.</p>
        </div>
        <MiniTag>7 STAGES</MiniTag>
      </div>
      <div className="pipeline-flow">
        {PIPELINE.map(({ title, icon: Icon }, i) => (
          <div className="pipeline-unit" key={title}>
            <button
              className={`pipeline-node ${i === step ? 'active' : ''} ${i < step ? 'visited' : ''}`}
              onClick={() => setStep(i)}
            >
              <span>
                <Icon size={22} />
              </span>
              <strong>{title}</strong>
              <small>STEP {String(i + 1).padStart(2, '0')}</small>
            </button>
            {i !== PIPELINE.length - 1 && (
              <ArrowRight className="pipeline-arrow" size={18} />
            )}
          </div>
        ))}
      </div>
      <div className="visual-detail">
        <div className="visual-detail-graphic">
          <Current size={35} />
          <span>{String(step + 1).padStart(2, '0')}</span>
        </div>
        <div>
          <div className="eyebrow">{PIPELINE[step].subtitle}</div>
          <h3>{PIPELINE[step].title}</h3>
          <p>{PIPELINE[step].detail}</p>
        </div>
        <button
          onClick={() => setStep((step + 1) % PIPELINE.length)}
          className="button primary"
        >
          Next stage <ArrowRight size={16} />
        </button>
      </div>
      <div className="visual-disclaimer">
        <Lightbulb size={15} /> The process loops through many batches of
        examples. This diagram shows the main concepts, not every internal
        tensor operation.
      </div>
    </div>
  );
}

function LoraDemo() {
  const [rank, setRank] = useState(8);
  const [showAdapter, setShowAdapter] = useState(true);
  return (
    <div className="visual-card">
      <div className="visual-head">
        <div>
          <div className="eyebrow">INTERACTIVE DIAGRAM / 02</div>
          <h2>Keep the base. Train the small addition.</h2>
          <p>
            Explore the difference between a frozen model and trainable adapter.
          </p>
        </div>
        <MiniTag>LoRA</MiniTag>
      </div>
      <div className="lora-layout">
        <div className="lora-drawing">
          <div className="lora-base">
            <div className="lora-state">
              <LockKeyhole size={17} /> FROZEN
            </div>
            <div className="lora-grid">
              {Array.from({ length: 49 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <strong>BASE WEIGHTS</strong>
            <span>Original learned knowledge</span>
          </div>
          <span className="lora-plus">+</span>
          <div className={`lora-adapter ${showAdapter ? '' : 'muted'}`}>
            <div className="lora-state green">
              <Zap size={17} /> TRAINABLE
            </div>
            <div
              className="lora-grid adapter-grid"
              style={{
                gridTemplateColumns: `repeat(${Math.max(2, Math.min(8, rank / 2))},1fr)`,
              }}
            >
              {Array.from({ length: Math.min(32, rank * 2) }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <strong>LoRA ADAPTER</strong>
            <span>Small weight updates</span>
          </div>
        </div>
        <div className="lora-controls">
          <div className="eyebrow">CONFIGURE THE ADAPTER</div>
          <div className="range-label">
            <strong>LoRA rank (r)</strong>
            <span>{rank}</span>
          </div>
          <input
            aria-label="LoRA rank"
            type="range"
            min="2"
            max="32"
            step="2"
            value={rank}
            onChange={(e) => setRank(Number(e.target.value))}
          />
          <div className="range-scale">
            <span>Smaller adapter</span>
            <span>Larger adapter</span>
          </div>
          <div className="switch-row">
            <div>
              <strong>Show trainable adapter</strong>
              <p>Turn it off to see why a frozen base alone cannot learn.</p>
            </div>
            <button
              aria-label="Toggle adapter"
              className={`toggle ${showAdapter ? 'on' : ''}`}
              onClick={() => setShowAdapter((p) => !p)}
            >
              <span />
            </button>
          </div>
          <div className="insight">
            <Lightbulb size={18} />
            <p>
              {!showAdapter
                ? 'With no adapter, this example has no trainable LoRA weights. The frozen base model stays unchanged.'
                : rank <= 8
                  ? 'A small rank keeps the adapter compact. It is a useful starting point for a beginner’s experiment.'
                  : 'A larger rank introduces more trainable capacity, but also uses more memory. More capacity is not automatically better.'}
            </p>
          </div>
        </div>
      </div>
      <div className="visual-disclaimer">
        The blocks are a conceptual illustration, not a literal representation
        of model tensors or measured parameter counts.
      </div>
    </div>
  );
}

function MemoryDemo() {
  const [model, setModel] = useState('0.6');
  const [precision, setPrecision] = useState('4');
  const [vram, setVram] = useState('4');
  const [overhead, setOverhead] = useState(1);
  const p = Number(model),
    bits = Number(precision),
    gpu = Number(vram);
  const weights = (p * bits) / 8;
  const estimated = weights * (1 + 0.18) + 0.7 + overhead * 0.25;
  const pct = Math.min(100, (estimated / gpu) * 100);
  return (
    <div className="visual-card">
      <div className="visual-head">
        <div>
          <div className="eyebrow">INTERACTIVE CALCULATOR / 03</div>
          <h2>How much VRAM will you need?</h2>
          <p>
            See why a 27B model and a 0.6B model are completely different
            hardware problems.
          </p>
        </div>
        <MiniTag>INFERENCE ONLY</MiniTag>
      </div>
      <div className="memory-grid">
        <div className="memory-inputs">
          <label>
            Model size{' '}
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="0.6">Qwen3 0.6B</option>
              <option value="1.7">1.7B model</option>
              <option value="4">4B model</option>
              <option value="8">8B model</option>
              <option value="14">14B model</option>
              <option value="27">27B model</option>
            </select>
          </label>
          <label>
            Weight precision{' '}
            <select
              value={precision}
              onChange={(e) => setPrecision(e.target.value)}
            >
              <option value="4">4-bit</option>
              <option value="8">8-bit</option>
              <option value="16">16-bit (FP16 / BF16)</option>
            </select>
          </label>
          <label>
            Dedicated GPU memory{' '}
            <select value={vram} onChange={(e) => setVram(e.target.value)}>
              <option value="4">4 GB · RTX 3050</option>
              <option value="8">8 GB</option>
              <option value="12">12 GB</option>
              <option value="16">16 GB</option>
              <option value="24">24 GB · RTX 3090</option>
              <option value="32">32 GB · RTX 5090</option>
            </select>
          </label>
          <div className="range-label">
            <strong>Extra context allowance</strong>
            <span>Level {overhead + 1}</span>
          </div>
          <input
            aria-label="Illustrative extra context allowance"
            type="range"
            min="0"
            max="4"
            step="1"
            value={overhead}
            onChange={(e) => setOverhead(Number(e.target.value))}
          />
          <p className="form-hint">
            Raises a simplified extra-memory buffer. Actual KV cache use depends
            on the model architecture and context length.
          </p>
        </div>
        <div className="memory-result">
          <div className="memory-stat-pair">
            <div>
              <span>RAW WEIGHTS</span>
              <strong>
                {weights.toFixed(2)} <small>GB</small>
              </strong>
            </div>
            <div>
              <span>ROUGH INFERENCE ESTIMATE</span>
              <strong>
                {estimated.toFixed(2)} <small>GB</small>
              </strong>
            </div>
          </div>
          <div className="memory-device">
            <div>
              <span>SELECTED GPU</span>
              <strong>{gpu} GB VRAM</strong>
            </div>
            <div className="memory-ruler">
              <div
                style={{
                  width: `${pct}%`,
                  background: estimated > gpu ? '#f29a74' : '#9be9c7',
                }}
              />
            </div>
            <div className="memory-ruler-caption">
              <span>0 GB</span>
              <span>{gpu} GB</span>
            </div>
          </div>
          <div
            className={`memory-verdict ${estimated > gpu ? 'warning' : 'good'}`}
          >
            {estimated > gpu ? (
              <>
                <CircleHelp size={17} /> Likely needs RAM offloading or a larger
                GPU
              </>
            ) : (
              <>
                <CheckCircle2 size={17} /> May fit for inference under these
                assumptions
              </>
            )}
          </div>
        </div>
      </div>
      <div className="visual-disclaimer">
        <CircleHelp size={15} /> This uses the approximate raw formula
        (parameters × bits ÷ 8) plus a teaching-only buffer. It is not a
        benchmark, a training estimate or a guarantee of fit. Quantisation
        formats, context, KV cache, GPU runtime and CPU offloading change the
        actual result.
      </div>
    </div>
  );
}

const curve = (mode, steps) =>
  Array.from({ length: steps + 1 }, (_, i) => {
    let x = i / steps;
    const base = 2.1 - 1.35 * (1 - Math.exp(-4 * x));
    let y = base + 0.028 * Math.sin(i * 2.3);
    if (mode === 'overfit')
      y =
        i > steps * 0.52
          ? 0.77 + (x - 0.52) * 1.05 + 0.03 * Math.sin(i * 1.3)
          : base + 0.08;
    if (mode === 'unstable')
      y = base + 0.34 * Math.sin(i * 0.78) + 0.13 * Math.cos(i * 1.61);
    return Math.max(0.18, y);
  });

function LossDemo() {
  const [mode, setMode] = useState('learning');
  const [steps, setSteps] = useState(30);
  const values = useMemo(() => curve(mode, steps), [mode, steps]);
  const points = values
    .map((y, i) => `${40 + (i / steps) * 670},${30 + ((2.8 - y) / 2.8) * 225}`)
    .join(' ');
  return (
    <div className="visual-card">
      <div className="visual-head">
        <div>
          <div className="eyebrow">INTERACTIVE SIMULATOR / 04</div>
          <h2>What does training loss tell you?</h2>
          <p>
            Compare example learning patterns. These are simulated curves, not
            results from Qwen or Colab.
          </p>
        </div>
        <MiniTag>SIMULATED DATA</MiniTag>
      </div>
      <div className="loss-tabs">
        {[
          ['learning', 'Healthy pattern'],
          ['overfit', 'Overfitting risk'],
          ['unstable', 'Unstable updates'],
        ].map(([id, label]) => (
          <button
            key={id}
            className={mode === id ? 'active' : ''}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="loss-chart">
        <div className="chart-axis-title">ILLUSTRATIVE LOSS</div>
        <svg
          viewBox="0 0 760 310"
          role="img"
          aria-label="Simulated training loss chart"
        >
          <g className="chart-grids">
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={i}
                x1="40"
                x2="710"
                y1={40 + i * 54}
                y2={40 + i * 54}
              />
            ))}
          </g>
          <g className="chart-labels">
            <text x="7" y="44">
              2.8
            </text>
            <text x="7" y="152">
              1.4
            </text>
            <text x="13" y="260">
              0.0
            </text>
            <text x="40" y="285">
              0
            </text>
            <text x="353" y="285">
              {Math.round(steps / 2)}
            </text>
            <text x="695" y="285">
              {steps}
            </text>
            <text x="323" y="305">
              TRAINING STEPS
            </text>
          </g>
          <polyline
            points={points}
            fill="none"
            stroke={
              mode === 'unstable'
                ? '#ef9373'
                : mode === 'overfit'
                  ? '#a79af7'
                  : '#70c5ac'
            }
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {values
            .filter((_, i) => i % Math.max(1, Math.round(steps / 10)) === 0)
            .map((y, i, arr) => (
              <circle
                key={i}
                cx={
                  40 +
                  (Math.min(steps, i * Math.max(1, Math.round(steps / 10))) /
                    steps) *
                    670
                }
                cy={30 + ((2.8 - y) / 2.8) * 225}
                r="4"
                fill="#111c2c"
                stroke={
                  mode === 'unstable'
                    ? '#ef9373'
                    : mode === 'overfit'
                      ? '#a79af7'
                      : '#70c5ac'
                }
                strokeWidth="2"
              />
            ))}
        </svg>
      </div>
      <div className="range-label">
        <strong>Number of simulated steps</strong>
        <span>{steps} steps</span>
      </div>
      <input
        type="range"
        aria-label="Simulation steps"
        min="10"
        max="100"
        step="10"
        value={steps}
        onChange={(e) => setSteps(Number(e.target.value))}
      />
      <div className="insight">
        <Lightbulb size={18} />
        <p>
          {mode === 'learning'
            ? 'Training loss falls in this illustration. Real generalisation must still be checked on a held-out evaluation set.'
            : mode === 'overfit'
              ? 'The curve illustrates a validation-loss rise after initial improvement. A training-loss curve alone would not reveal overfitting.'
              : 'Large oscillations can indicate an unstable optimisation setup, but real causes require checking learning rate, batches, data and logs.'}
        </p>
      </div>
      <div className="visual-disclaimer">
        Only a simulated training curve is drawn. In the overfitting scenario
        this represents a held-out validation trend, not the training-loss
        series. Do not use these numbers as measured performance.
      </div>
    </div>
  );
}

export {
  PIPELINE,
  VisualizerPage,
  PipelineDemo,
  LoraDemo,
  MemoryDemo,
  curve,
  LossDemo,
};
