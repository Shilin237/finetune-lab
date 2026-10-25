'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Cloud, Search, X } from 'lucide-react';
import { glossary } from '@/data/lessonData';
import { SectionHeading } from '../ui';

const resources = [
  {
    title: 'Google Colab',
    desc: 'Cloud notebooks and GPU availability',
    url: 'https://colab.research.google.com/',
  },
  {
    title: 'Unsloth documentation',
    desc: 'Maintained fine tuning guides and notebooks',
    url: 'https://unsloth.ai/docs/get-started/unsloth-notebooks',
  },
  {
    title: 'Qwen3 in Unsloth',
    desc: 'Architecture and training guidance',
    url: 'https://unsloth.ai/docs/models/tutorials/qwen3-how-to-run-and-fine-tune',
  },
  {
    title: 'TRL SFTTrainer',
    desc: 'Trainer API and configuration',
    url: 'https://huggingface.co/docs/trl/sft_trainer',
  },
  {
    title: 'Ollama Modelfile',
    desc: 'Create and run a compatible local model',
    url: 'https://docs.ollama.com/modelfile',
  },
];

function GlossaryPage() {
  const [search, setSearch] = useState('');
  const filtered = glossary.filter(([word, description]) =>
    `${word} ${description}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <SectionHeading
        eyebrow="YOUR QUICK REFERENCE"
        title="The words, explained simply."
        description="No need to memorise jargon. Use this reference whenever a term appears in the lessons or notebook."
      />
      <div className="glossary-search">
        <Search size={19} />
        <input
          aria-label="Search glossary"
          placeholder="Search a concept, e.g. QLoRA, gradient, epoch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} aria-label="Clear search">
            <X size={17} />
          </button>
        )}
      </div>
      <div className="glossary-count">{filtered.length} TERMS</div>
      <div className="glossary-grid">
        {filtered.map(([word, description]) => (
          <article className="glossary-card" key={word}>
            <span>{word.charAt(0)}</span>
            <h3>{word}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">No matches. Try another term.</div>
      )}
      <div className="resources-panel">
        <div>
          <div className="eyebrow">LEARN FROM THE SOURCE</div>
          <h2>Official references</h2>
          <p>
            These links lead to maintainers' documentation. Check them when
            package APIs change.
          </p>
        </div>
        <div>
          {resources.map((r) => (
            <a key={r.title} href={r.url} target="_blank" rel="noreferrer">
              <div>
                <strong>{r.title}</strong>
                <small>{r.desc}</small>
              </div>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export { resources, GlossaryPage };
