'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Database,
  Download,
  Lightbulb,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { SectionHeading, downloadText, CodePanel } from '../ui';

const INITIAL_DATA = [
  {
    id: 1,
    question: 'What is a variable?',
    answer: 'Meaning: A named place to store a value.\nExample: count = 3',
    set: 'train',
  },
  {
    id: 2,
    question: 'Explain a for loop.',
    answer:
      'Meaning: A way to repeat instructions.\nExample: for x in items: print(x)',
    set: 'train',
  },
  {
    id: 3,
    question: 'What is a Python function?',
    answer:
      'Meaning: A reusable block of code.\nExample: def add(a, b): return a + b',
    set: 'train',
  },
  {
    id: 4,
    question: 'What is a list?',
    answer:
      'Meaning: An ordered collection of values.\nExample: items = [1, 2]',
    set: 'train',
  },
  {
    id: 5,
    question: 'Explain recursion.',
    answer:
      'Meaning: A function solving a problem by calling itself.\nExample: def f(n): return 1 if n == 0 else n * f(n-1)',
    set: 'test',
  },
  {
    id: 6,
    question: 'What is a generator?',
    answer:
      'Meaning: A function that yields values lazily.\nExample: def nums(): yield 1',
    set: 'test',
  },
];

const CUSTOM_DATASET_IMPORT = `# Replace Colab notebook step 05 with this cell.
# First export BOTH JSONL files from Dataset Studio.
from google.colab import files
import json

uploaded = files.upload()  # Select finetune-train.jsonl and finetune-test.jsonl

def read_rows(filename):
    raw = uploaded[filename].decode("utf-8")
    return [json.loads(line) for line in raw.splitlines() if line.strip()]

train_rows = read_rows("finetune-train.jsonl")
test_rows = read_rows("finetune-test.jsonl")

assert all(row.get("question") and row.get("answer") for row in train_rows)
assert all(row.get("question") and row.get("answer") for row in test_rows)
print("Training:", len(train_rows), "Held-out test:", len(test_rows))
# Continue with notebook step 06 to apply Qwen's chat template.
`;

function DatasetPage() {
  const [rows, setRows] = useState(INITIAL_DATA);
  const [datasetLoaded, setDatasetLoaded] = useState(false);
  const [active, setActive] = useState('train');
  const [draft, setDraft] = useState({ question: '', answer: '' });
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showImportCode, setShowImportCode] = useState(false);
  useEffect(() => {
    try {
      let saved = localStorage.getItem('ftl_dataset');
      if (saved) {
        let data = JSON.parse(saved);
        if (Array.isArray(data)) setRows(data);
      }
    } catch {}
    setDatasetLoaded(true);
  }, []);
  useEffect(() => {
    if (datasetLoaded)
      localStorage.setItem('ftl_dataset', JSON.stringify(rows));
  }, [rows, datasetLoaded]);
  const training = rows.filter((r) => r.set === 'train'),
    test = rows.filter((r) => r.set === 'test'),
    visible = active === 'train' ? training : test;
  const duplicates = rows.filter(
    (r, i) =>
      rows.findIndex(
        (x) =>
          x.question.trim().toLowerCase() === r.question.trim().toLowerCase(),
      ) !== i,
  );
  const invalid = rows.filter((x) => !x.question.trim() || !x.answer.trim());
  const add = () => {
    if (!draft.question.trim() || !draft.answer.trim()) {
      setError('Provide both a question and an expected answer.');
      return;
    }
    if (
      rows.some(
        (x) =>
          x.question.trim().toLowerCase() ===
          draft.question.trim().toLowerCase(),
      )
    ) {
      setError('This question already exists. Write a different question.');
      return;
    }
    setRows((p) => [
      ...p,
      {
        id: Date.now(),
        question: draft.question.trim(),
        answer: draft.answer.trim(),
        set: active,
      },
    ]);
    setDraft({ question: '', answer: '' });
    setError('');
  };
  const exportRows = (set) => {
    const selected = rows.filter((r) => r.set === set);
    if (!selected.length) return;
    downloadText(
      `finetune-${set}.jsonl`,
      selected
        .map((x) => JSON.stringify({ question: x.question, answer: x.answer }))
        .join('\n') + '\n',
      'application/x-ndjson',
    );
  };
  const onImport = () => {
    try {
      let parsed = importText
        .split(/\r?\n/)
        .filter(Boolean)
        .map((x, i) => {
          let obj = JSON.parse(x);
          if (
            typeof obj.question !== 'string' ||
            typeof obj.answer !== 'string' ||
            !obj.question.trim() ||
            !obj.answer.trim()
          )
            throw new Error(
              `Line ${i + 1} must have nonempty question and answer strings`,
            );
          return {
            id: Date.now() + i,
            question: obj.question,
            answer: obj.answer,
            set: active,
          };
        });
      if (!parsed.length) throw new Error('No JSONL records found.');
      setRows((p) => [...p, ...parsed]);
      setImportOpen(false);
      setImportText('');
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <>
      <SectionHeading
        eyebrow="HANDS-ON DATA PREPARATION"
        title="Build a dataset that teaches."
        description="Create training examples and keep test questions separate. Inspect what you are teaching before a single GPU minute is spent."
        actions={
          <button
            className="button outline"
            onClick={() => setShowGuide((p) => !p)}
          >
            <CircleHelp size={16} /> {showGuide ? 'Hide' : 'How it works'}
          </button>
        }
      />
      {showGuide && (
        <div className="info-note">
          <strong>What is this editor for?</strong>
          <p>
            It saves educational examples in your browser and exports simple
            JSONL with question and answer fields. The supplied Colab notebook
            constructs its own demonstration dataset. To use exports from this
            editor, you must upload the JSONL into Colab and adapt notebook step
            05 to read your rows, then continue with step 06 to build the
            correct Qwen chat template. Test rows must never enter the trainer.
            Your browser data is not sent to a server by this project.
          </p>
        </div>
      )}
      <div className="dataset-top-stats">
        <div>
          <Database size={21} />
          <span>TRAINING EXAMPLES</span>
          <strong>{training.length}</strong>
          <small>Practice pairs</small>
        </div>
        <div>
          <ShieldCheck size={21} />
          <span>UNSEEN EVALUATION</span>
          <strong>{test.length}</strong>
          <small>Held out from training</small>
        </div>
        <div>
          <ClipboardCheck size={21} />
          <span>VALIDATION</span>
          <strong>
            {duplicates.length + invalid.length === 0 ? 'PASS' : 'CHECK'}
          </strong>
          <small>
            {duplicates.length} duplicate questions · {invalid.length}{' '}
            incomplete
          </small>
        </div>
      </div>
      <div className="dataset-layout">
        <div className="dataset-main panel">
          <div className="dataset-head">
            <div className="dataset-tabs">
              <button
                onClick={() => setActive('train')}
                className={active === 'train' ? 'active' : ''}
              >
                Training <span>{training.length}</span>
              </button>
              <button
                onClick={() => setActive('test')}
                className={active === 'test' ? 'active' : ''}
              >
                Held-out test <span>{test.length}</span>
              </button>
            </div>
            <div className="dataset-actions">
              <button
                className="subtle-button"
                onClick={() => {
                  setImportOpen((p) => !p);
                  setError('');
                }}
              >
                <Plus size={15} /> Import JSONL
              </button>
              <button
                className="subtle-button"
                onClick={() => exportRows(active)}
                disabled={visible.length === 0}
              >
                <Download size={15} /> Export JSONL
              </button>
            </div>
          </div>
          {importOpen && (
            <div className="import-area">
              <label>
                Paste one JSON object per line, each with question and answer
                strings.
              </label>
              <textarea
                aria-label="JSONL examples"
                rows={4}
                placeholder={
                  '{"question":"What is...","answer":"Meaning: ...\\nExample: ..."}'
                }
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <button className="button dark" onClick={onImport}>
                Import into {active}
              </button>
            </div>
          )}
          <div className="data-records">
            {visible.length === 0 && (
              <div className="empty-state">
                No records yet. Add the first one using the form.
              </div>
            )}
            {visible.map((r, i) => (
              <div className="data-record" key={r.id}>
                <div className="record-num">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="record-content">
                  <span>QUESTION</span>
                  <strong>{r.question}</strong>
                  <span>EXPECTED ANSWER</span>
                  <pre>{r.answer}</pre>
                </div>
                <button
                  title="Delete example"
                  aria-label={`Delete example ${i + 1}`}
                  onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <aside className="panel dataset-editor">
          <div className="eyebrow">YOUR NEXT EXAMPLE</div>
          <h2>Add a {active === 'train' ? 'training' : 'test'} record</h2>
          <p>
            {active === 'train'
              ? 'Write a good question and the answer you want the model to learn.'
              : 'Keep this question genuinely unseen. It will be used for evaluating, not training.'}
          </p>
          <label>
            USER QUESTION
            <textarea
              rows={3}
              value={draft.question}
              onChange={(e) =>
                setDraft((p) => ({ ...p, question: e.target.value }))
              }
              placeholder="What is a Python class?"
            />
          </label>
          <label>
            EXPECTED RESPONSE
            <textarea
              rows={6}
              value={draft.answer}
              onChange={(e) =>
                setDraft((p) => ({ ...p, answer: e.target.value }))
              }
              placeholder={
                'Meaning: A blueprint for objects.\nExample: class Person: pass'
              }
            />
          </label>
          {error && (
            <div role="alert" className="input-error">
              {error}
            </div>
          )}
          <button className="button primary wide" onClick={add}>
            <Plus size={16} /> Add example
          </button>
          <div className="editor-help">
            <Lightbulb size={17} />
            <p>
              Accuracy is more important than volume. Do not upload secrets or
              private company code into public cloud notebooks.
            </p>
          </div>
        </aside>
      </div>
      <div className="info-note">
        <strong>Train/test safety:</strong> The download buttons export exactly
        the selected split. The notebook's trainer should receive only training
        examples. Use the held-out set only for baseline and final comparison.
      </div>
      <div className="custom-dataset-guide">
        <div>
          <div className="eyebrow">OPTIONAL / TAKE YOUR DATA INTO COLAB</div>
          <h2>Use your own exported examples</h2>
          <p>
            Export both splits as JSONL. In the provided Colab notebook, replace
            cell 05 (the demonstration dataset creator) with this upload cell.
            Keep cells 06 onward unchanged. This does not automatically upload
            any private browser data.
          </p>
        </div>
        <button
          className="button outline"
          onClick={() => setShowImportCode((p) => !p)}
        >
          {showImportCode ? 'Hide import cell' : 'Show import cell'}{' '}
          <ChevronDown size={15} />
        </button>
      </div>
      {showImportCode && (
        <CodePanel
          code={CUSTOM_DATASET_IMPORT}
          label="OPTIONAL · REPLACE NOTEBOOK CELL 05"
        />
      )}
    </>
  );
}

export { INITIAL_DATA, CUSTOM_DATASET_IMPORT, DatasetPage };
