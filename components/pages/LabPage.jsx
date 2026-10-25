'use client';

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Download,
  ExternalLink,
  FileText,
  Settings2,
} from 'lucide-react';
import labSteps from '@/data/labSteps.json';
import { SectionHeading, MiniTag, CodePanel } from '../ui';

function LabPage({ labIndex, setLabIndex, labDone, toggleDone }) {
  const s = labSteps[labIndex];
  return (
    <>
      <SectionHeading
        eyebrow="THE PRACTICAL WORKBENCH"
        title="Your first fine tuning lab."
        description="Follow the real Qwen3 0.6B and Unsloth notebook. Every code cell comes with its purpose, explanation, expected result and troubleshooting."
        actions={
          <a
            className="button primary"
            href="/downloads/qwen-unsloth-lab.ipynb"
            download
          >
            <Download size={16} /> Download .ipynb
          </a>
        }
      />
      <div className="lab-intro">
        <div>
          <span className="lab-intro-icon">
            <Cloud size={20} />
          </span>
          <strong>Run this in Google Colab, not in the website.</strong>
          <p>
            Open{' '}
            <a
              href="https://colab.research.google.com/"
              target="_blank"
              rel="noreferrer"
            >
              Google Colab <ExternalLink size={12} />
            </a>
            , upload the downloaded notebook, select a GPU, and execute the
            cells in order. This page is the annotated guide.
          </p>
        </div>
        <MiniTag>QWEN3 · 0.6B</MiniTag>
      </div>
      <div className="lab-workspace">
        <aside className="lab-steps">
          <div className="lab-steps-header">
            NOTEBOOK CELLS <span>{labDone.length} / 14</span>
          </div>
          {labSteps.map((step, i) => (
            <button
              key={step.id}
              className={i === labIndex ? 'selected' : ''}
              onClick={() => {
                setLabIndex(i);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span
                className={`lab-step-num ${labDone.includes(step.id) ? 'completed' : ''}`}
              >
                {labDone.includes(step.id) ? (
                  <Check size={12} />
                ) : (
                  String(step.id).padStart(2, '0')
                )}
              </span>
              <span>{step.title}</span>
            </button>
          ))}
        </aside>
        <div className="lab-detail">
          <div className="lab-detail-heading">
            <div className="eyebrow">
              CELL {String(s.id).padStart(2, '0')} / 14
            </div>
            <h2>{s.title}</h2>
            <p>{s.why}</p>
          </div>
          <CodePanel key={s.id} code={s.code} />
          <div className="explain-grid">
            <div className="explain-card span-wide">
              <div className="explain-title">
                <BookOpen size={17} /> WHAT EACH PART DOES
              </div>
              <p>{s.explanation}</p>
            </div>
            <div className="explain-card">
              <div className="explain-title">
                <CheckCircle2 size={17} /> EXPECTED RESULT
              </div>
              <p>{s.expected}</p>
            </div>
            <div className="explain-card">
              <div className="explain-title">
                <ClipboardCheck size={17} /> VERIFY IT WORKED
              </div>
              <p>{s.check}</p>
            </div>
            <div className="explain-card troubleshoot span-wide">
              <div className="explain-title">
                <Settings2 size={17} /> IF SOMETHING GOES WRONG
              </div>
              <p>{s.trouble}</p>
            </div>
          </div>
          <div className="lab-navigation">
            <button
              className="button outline"
              disabled={labIndex === 0}
              onClick={() => setLabIndex(Math.max(0, labIndex - 1))}
            >
              <ArrowLeft size={15} /> Previous
            </button>
            <button
              className={`button ${labDone.includes(s.id) ? 'outline' : 'primary'}`}
              onClick={() => toggleDone(s.id, true)}
            >
              {labDone.includes(s.id) ? (
                <>
                  <Check size={15} /> Completed
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} /> Mark done
                </>
              )}
            </button>
            <button
              className="button outline"
              disabled={labIndex === 13}
              onClick={() => setLabIndex(Math.min(13, labIndex + 1))}
            >
              Next <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <div className="resource-strip">
        <FileText size={20} />
        <div>
          <strong>Want the complete written explanation?</strong>
          <p>
            The 18-page Word handbook and runnable Colab notebook are included
            in this project.
          </p>
        </div>
        <a href="/downloads/complete-handbook.docx" download>
          Download handbook <Download size={15} />
        </a>
      </div>
    </>
  );
}

export { LabPage };
