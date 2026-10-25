'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { SectionHeading, downloadText } from '../ui';

const EVAL_START = [
  {
    id: 1,
    q: 'What is recursion?',
    before: '',
    after: '',
    beforeMeaning: false,
    afterMeaning: false,
    beforeExample: false,
    afterExample: false,
  },
  {
    id: 2,
    q: 'Explain a generator.',
    before: '',
    after: '',
    beforeMeaning: false,
    afterMeaning: false,
    beforeExample: false,
    afterExample: false,
  },
  {
    id: 3,
    q: 'What is a decorator?',
    before: '',
    after: '',
    beforeMeaning: false,
    afterMeaning: false,
    beforeExample: false,
    afterExample: false,
  },
];

function formatPass(txt) {
  const lines = txt
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    lines.length === 2 &&
    lines[0].startsWith('Meaning:') &&
    lines[1].startsWith('Example:')
  );
}

function EvaluationPage() {
  const [items, setItems] = useState(EVAL_START);
  const [evalLoaded, setEvalLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('ftl_evaluation') || 'null',
      );
      if (Array.isArray(saved) && saved.length) setItems(saved);
    } catch {}
    setEvalLoaded(true);
  }, []);
  useEffect(() => {
    if (evalLoaded)
      localStorage.setItem('ftl_evaluation', JSON.stringify(items));
  }, [items, evalLoaded]);
  const item = items[index] || items[0];
  const update = (field, value) =>
    setItems((p) =>
      p.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  const complete = items.filter((x) => x.before.trim() && x.after.trim());
  const baseFormat = complete.filter((x) => formatPass(x.before)).length;
  const afterFormat = complete.filter((x) => formatPass(x.after)).length;
  const baseMeaning = complete.filter((x) => x.beforeMeaning).length;
  const afterMeaning = complete.filter((x) => x.afterMeaning).length;
  const baseExample = complete.filter((x) => x.beforeExample).length;
  const afterExample = complete.filter((x) => x.afterExample).length;
  const exportCsv = () => {
    const header = [
      'question',
      'before',
      'after',
      'before_format',
      'after_format',
      'before_meaning_correct',
      'after_meaning_correct',
      'before_example_correct',
      'after_example_correct',
    ];
    const quote = (x) => '"' + String(x).replaceAll('"', '""') + '"';
    downloadText(
      'finetune-evaluation.csv',
      [
        header.map(quote).join(','),
        ...items.map((r) =>
          [
            r.q,
            r.before,
            r.after,
            r.before ? formatPass(r.before) : '',
            r.after ? formatPass(r.after) : '',
            r.beforeMeaning,
            r.afterMeaning,
            r.beforeExample,
            r.afterExample,
          ]
            .map(quote)
            .join(','),
        ),
      ].join('\n'),
      'text/csv',
    );
  };
  return (
    <>
      <SectionHeading
        eyebrow="BEFORE & AFTER / EVIDENCE"
        title="Did your model actually improve?"
        description="Paste real outputs from Colab. Compare identical held-out questions and score the structure and factual quality separately."
        actions={
          <button className="button outline" onClick={exportCsv}>
            <Download size={16} /> Export results
          </button>
        }
      />
      <div className="info-note eval-banner">
        <ShieldCheck size={18} />
        <p>
          <strong>No invented benchmark numbers.</strong> This studio is
          intentionally empty until you paste responses from your real model
          runs. It will never simulate performance gains and present them as
          measured results.
        </p>
        <button onClick={() => setShowHelp((p) => !p)} className="text-link">
          {showHelp ? 'Hide guidance' : 'Scoring guidance'}{' '}
          <ChevronDown size={15} />
        </button>
      </div>
      {showHelp && (
        <div className="info-note">
          <strong>Fair evaluation checklist</strong>
          <p>
            Record the original model's answers before attaching LoRA. Run the
            same questions, system prompt and generation settings after
            training. A correct format has exactly two nonempty lines starting
            Meaning: and Example:. Manually judge whether the meaning is true
            and whether the example is valid. A result on just three examples is
            not a reliable performance claim.
          </p>
        </div>
      )}
      <div className="eval-metrics">
        <div>
          <span>COMPARISONS COMPLETED</span>
          <strong>
            {complete.length}
            <small> / {items.length}</small>
          </strong>
        </div>
        <div>
          <span>FORMAT · BEFORE / AFTER</span>
          <strong>
            {complete.length
              ? `${Math.round((baseFormat / complete.length) * 100)}% / ${Math.round((afterFormat / complete.length) * 100)}%`
              : '— / —'}
          </strong>
        </div>
        <div>
          <span>MEANING · BEFORE / AFTER</span>
          <strong>
            {complete.length
              ? `${Math.round((baseMeaning / complete.length) * 100)}% / ${Math.round((afterMeaning / complete.length) * 100)}%`
              : '— / —'}
          </strong>
        </div>
        <div>
          <span>EXAMPLE · BEFORE / AFTER</span>
          <strong>
            {complete.length
              ? `${Math.round((baseExample / complete.length) * 100)}% / ${Math.round((afterExample / complete.length) * 100)}%`
              : '— / —'}
          </strong>
        </div>
      </div>
      <div className="eval-layout">
        <div className="eval-question-list">
          <div className="eyebrow">HELD-OUT QUESTIONS</div>
          {items.map((r, i) => (
            <button
              key={r.id}
              className={index === i ? 'active' : ''}
              onClick={() => setIndex(i)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{r.q}</strong>
              {r.before.trim() && r.after.trim() ? (
                <CheckCircle2 size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          ))}
          <button
            className="eval-add"
            onClick={() => {
              setItems((p) => [
                ...p,
                {
                  id: Date.now(),
                  q: 'New unseen question',
                  before: '',
                  after: '',
                  beforeMeaning: false,
                  afterMeaning: false,
                  beforeExample: false,
                  afterExample: false,
                },
              ]);
              setIndex(items.length);
            }}
          >
            <Plus size={15} /> Add question
          </button>
        </div>
        <div className="eval-workspace">
          <div className="eval-question-head">
            <div className="eyebrow">
              TEST PROMPT {String(index + 1).padStart(2, '0')}
            </div>
            <input
              aria-label="Evaluation question"
              value={item.q}
              onChange={(e) => update('q', e.target.value)}
            />
          </div>
          <div className="eval-comparison">
            {['before', 'after'].map((kind) => (
              <div className="eval-response" key={kind}>
                <div className="eval-response-head">
                  <span className={`eval-pin ${kind}`} />
                  {kind === 'before' ? 'BEFORE TRAINING' : 'AFTER TRAINING'}
                  <span>{kind === 'before' ? 'BASE MODEL' : 'FINE TUNED'}</span>
                </div>
                <textarea
                  placeholder={
                    kind === 'before'
                      ? 'Paste original Qwen response here...'
                      : 'Paste fine tuned Qwen response here...'
                  }
                  value={item[kind]}
                  onChange={(e) => update(kind, e.target.value)}
                />
                <div className="eval-grade">
                  <div className="eval-auto">
                    {item[kind].trim() ? (
                      formatPass(item[kind]) ? (
                        <>
                          <Check size={15} /> Two-line format: pass
                        </>
                      ) : (
                        <>
                          <X size={15} /> Two-line format: not met
                        </>
                      )
                    ) : (
                      'Waiting for real output'
                    )}
                  </div>
                  <label>
                    <input
                      type="checkbox"
                      checked={item[kind + 'Meaning']}
                      onChange={(e) =>
                        update(kind + 'Meaning', e.target.checked)
                      }
                    />{' '}
                    Meaning factually correct
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={item[kind + 'Example']}
                      onChange={(e) =>
                        update(kind + 'Example', e.target.checked)
                      }
                    />{' '}
                    Example correct / valid
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="eval-bottom">
            <p>
              <ShieldCheck size={16} /> Manual checkboxes are independent of
              automatic format scoring.
            </p>
            <button
              className="button outline"
              onClick={() => {
                setItems((p) => p.filter((_, i) => i !== index));
                setIndex(Math.max(0, index - 1));
              }}
              disabled={items.length <= 1}
            >
              <Trash2 size={15} /> Remove prompt
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export { EVAL_START, formatPass, EvaluationPage };
