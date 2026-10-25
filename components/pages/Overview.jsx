'use client';

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  Download,
  Play,
  SlidersHorizontal,
  Terminal,
} from 'lucide-react';
import { chapters } from '@/data/lessonData';
import { ProgressMeter, Illustration, MetricCard } from '../ui';

function Overview({ navigate, setChapterIndex, totalCompletion, done }) {
  return (
    <>
      <div className="hero">
        <div className="hero-grid" />
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" /> THE BEGINNER'S FIELD GUIDE{' '}
            <span className="hero-issue">V 1.0 · OCT 2026</span>
          </div>
          <h1>
            Fine tune your
            <br />
            <span>first AI model.</span>
          </h1>
          <p>
            From “what is fine tuning?” to a trained Qwen model. One guided
            experiment, explained step by step. No expensive GPU required.
          </p>
          <div className="hero-buttons">
            <button
              className="button primary light"
              onClick={() => {
                setChapterIndex(0);
                navigate('lessons');
              }}
            >
              Start learning <ArrowRight size={17} />
            </button>
            <button
              className="button outline-light"
              onClick={() => navigate('lab')}
            >
              <Terminal size={17} /> View the lab
            </button>
          </div>
          <div className="hero-footnote">
            <span className="pulse-marker" /> START WITH QWEN3 0.6B{' '}
            <span className="dot-sep">·</span> TRAIN IN GOOGLE COLAB
          </div>
        </div>
        <Illustration />
      </div>
      <div className="metrics">
        <MetricCard
          value="08"
          label="Guided chapters"
          desc="Understand every concept first."
          icon={BookOpen}
        />
        <MetricCard
          value="14"
          label="Executable lab steps"
          desc="With code and troubleshooting."
          icon={Terminal}
        />
        <MetricCard
          value="0.6B"
          label="Starting model"
          desc="Small enough for a first cloud run."
          icon={Cpu}
        />
        <MetricCard
          value="Free*"
          label="Hardware to begin"
          desc="Colab GPU access permitting."
          icon={Cloud}
        />
      </div>
      <div className="overview-columns">
        <section className="panel pathway-panel">
          <div className="panel-title-row">
            <div>
              <div className="eyebrow">THE ROADMAP</div>
              <h2>Learn it. Build it. Prove it.</h2>
            </div>
            <button className="text-link" onClick={() => navigate('lessons')}>
              All chapters <ArrowRight size={16} />
            </button>
          </div>
          <div className="pathway">
            {chapters.slice(0, 5).map((c, i) => (
              <button
                className="pathway-step"
                key={c.id}
                onClick={() => {
                  setChapterIndex(i);
                  navigate('lessons');
                }}
              >
                <div
                  className={`pathway-marker ${done.includes(c.id) ? 'done' : ''}`}
                >
                  {done.includes(c.id) ? <Check size={15} /> : c.chapter}
                </div>
                <div>
                  <div className="pathway-title">{c.title}</div>
                  <div className="pathway-subtitle">
                    {c.duration} <span>·</span> {c.level}
                  </div>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
          <button className="pathway-more" onClick={() => navigate('lessons')}>
            See all 8 chapters <ArrowRight size={15} />
          </button>
        </section>
        <section className="panel experience-panel">
          <div className="eyebrow">LEARNING BY DOING</div>
          <h2>More than a handbook.</h2>
          <p className="panel-intro">
            Every tool here exists to help you understand what is happening
            inside the training process.
          </p>
          <div className="feature-list">
            <button onClick={() => navigate('visualizer')}>
              <span className="feature-icon violet">
                <SlidersHorizontal size={20} />
              </span>
              <div>
                <strong>Visual explorer</strong>
                <p>Manipulate memory, LoRA and training settings.</p>
              </div>
              <ArrowUpRight size={16} />
            </button>
            <button onClick={() => navigate('dataset')}>
              <span className="feature-icon mint">
                <Database size={20} />
              </span>
              <div>
                <strong>Dataset studio</strong>
                <p>Build examples, keep tests separate and export JSONL.</p>
              </div>
              <ArrowUpRight size={16} />
            </button>
            <button onClick={() => navigate('evaluate')}>
              <span className="feature-icon amber">
                <BarChart3 size={20} />
              </span>
              <div>
                <strong>Evaluation studio</strong>
                <p>Compare your real before and after outputs.</p>
              </div>
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="tiny-progress">
            <div>
              <span>YOUR JOURNEY</span>
              <strong>{totalCompletion}% complete</strong>
            </div>
            <ProgressMeter value={totalCompletion} />
          </div>
        </section>
      </div>
      <div className="bottom-banner">
        <div>
          <div className="eyebrow">READY FOR THE REAL THING?</div>
          <h2>The complete notebook is included.</h2>
          <p>
            Follow a small, honest training experiment with expected outputs and
            explanations for each cell.
          </p>
        </div>
        <div className="bottom-banner-actions">
          <button className="button dark" onClick={() => navigate('lab')}>
            <Play size={16} /> Explore lab steps
          </button>
          <a
            className="button outline"
            href="/downloads/qwen-unsloth-lab.ipynb"
            download
          >
            <Download size={16} /> Notebook
          </a>
        </div>
      </div>
      <p className="footnote">
        * Google Colab free GPU allocation is not guaranteed. Training libraries
        and cloud limits can change. The site is an educational guide; real
        training happens in the downloadable Colab notebook.
      </p>
    </>
  );
}

export { Overview };
