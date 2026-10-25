'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  Cpu,
  Database,
  LockKeyhole,
  Sparkles,
} from 'lucide-react';
import { PIPELINE } from './pages/VisualizerPage';

function pretty(str) {
  return String(str ?? '');
}

function SectionHeading({ eyebrow, title, description, actions }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="section-actions">{actions}</div>}
    </div>
  );
}

function MiniTag({ children, accent = false }) {
  return (
    <span className={accent ? 'mini-tag accent' : 'mini-tag'}>{children}</span>
  );
}

function ProgressMeter({ value }) {
  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function callCopy(value, setCopied) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => {});
  }
}

function downloadText(filename, content, mime = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function CodePanel({ code, label = 'PYTHON · GOOGLE COLAB' }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-panel">
      <div className="code-bar">
        <span>
          <span className="term-dots">
            <i />
            <i />
            <i />
          </span>
          {label}
        </span>
        <button
          onClick={() => callCopy(code, setCopied)}
          className="subtle-button"
        >
          <Copy size={13} />
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Illustration() {
  return (
    <div className="hero-diagram">
      <div className="hero-diagram-top">
        <span className="live-dot" /> YOUR FIRST TRAINING PIPELINE{' '}
        <span className="hero-diagram-right">01 / 03</span>
      </div>
      <div className="hero-diagram-content">
        <div className="diagram-card input">
          <Database size={22} />
          <span>YOUR DATA</span>
          <strong>48 examples</strong>
          <div className="fake-lines">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="connection">
          <span />
          <ArrowRight size={20} />
        </div>
        <div className="diagram-card base">
          <div className="microchip">
            <Cpu size={36} />
          </div>
          <span>BASE MODEL</span>
          <strong>Qwen3 · 0.6B</strong>
          <div className="frozen">
            <LockKeyhole size={11} /> FROZEN WEIGHTS
          </div>
        </div>
        <div className="connection">
          <span />
          <ArrowRight size={20} />
        </div>
        <div className="diagram-card adapter">
          <Sparkles size={22} />
          <span>LoRA ADAPTER</span>
          <strong>Trained!</strong>
          <div className="adapter-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="hero-diagram-footer">
        <div>
          <span className="small-label">COMPUTE</span>
          <b>Google Colab GPU</b>
        </div>
        <div>
          <span className="small-label">TRAINER</span>
          <b>Unsloth</b>
        </div>
        <div className="diagram-status">
          <Check size={14} /> beginner friendly
        </div>
      </div>
    </div>
  );
}

function MetricCard({ value, label, desc, icon: Icon }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">
        <Icon size={18} />
      </span>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      <p>{desc}</p>
    </div>
  );
}

export {
  pretty,
  SectionHeading,
  MiniTag,
  ProgressMeter,
  callCopy,
  downloadText,
  CodePanel,
  Illustration,
  MetricCard,
};
