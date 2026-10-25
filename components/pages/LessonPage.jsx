'use client';

import {
  ArrowRight,
  Check,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { chapters } from '@/data/lessonData';
import { SectionHeading, MiniTag } from '../ui';

function LessonPage({
  chapterIndex,
  setChapterIndex,
  done,
  toggleDone,
  quizAnswers,
  setQuizAnswers,
  navigate,
}) {
  const c = chapters[chapterIndex];
  const isDone = done.includes(c.id);
  const ans = quizAnswers[c.id];
  return (
    <>
      <SectionHeading
        eyebrow={`YOUR LEARNING PATH / CHAPTER ${c.chapter} OF 08`}
        title={c.title}
        description={c.intro}
        actions={<MiniTag>{c.duration} READING</MiniTag>}
      />
      <div className="lesson-layout">
        <div className="lesson-main">
          <div className="lesson-eyeline">
            <MiniTag accent>{c.level}</MiniTag>
            <span>CHAPTER {c.chapter}</span>
          </div>
          <div className="big-number">{c.chapter}</div>
          <section className="lesson-analogy">
            <div className="analogy-icon">
              <Lightbulb size={19} />
            </div>
            <div>
              <div className="eyebrow">A SIMPLE WAY TO THINK ABOUT IT</div>
              <p>{c.analogy}</p>
            </div>
          </section>
          {(chapterIndex === 1 || chapterIndex === 2) && (
            <figure className="lesson-figure">
              <img
                src={
                  chapterIndex === 1
                    ? '/illustrations/tool-stack.svg'
                    : '/illustrations/lora-architecture.svg'
                }
                alt={
                  chapterIndex === 1
                    ? 'The Colab, Qwen, Unsloth and Ollama roles in the learning workflow'
                    : 'How frozen base weights combine with a small trainable LoRA adapter'
                }
              />
              <figcaption>
                {chapterIndex === 1
                  ? 'Colab provides the GPU, Qwen the weights, Unsloth training efficiency and Ollama optional local inference.'
                  : 'LoRA changes small adapter weights while leaving original base weights frozen.'}
              </figcaption>
            </figure>
          )}
          <h2 className="small-heading">What you'll understand</h2>
          <div className="outcome-list">
            {c.learn.map((item) => (
              <div key={item}>
                <CheckCircle2 size={17} />
                {item}
              </div>
            ))}
          </div>
          {c.blocks.map((b, i) => (
            <section className="lesson-block" key={i}>
              <div className="lesson-block-head">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h3>{b.title}</h3>
              </div>
              <p>{b.body}</p>
            </section>
          ))}
          <div className="activity-card">
            <div>
              <FlaskConical size={20} /> <span>TRY THIS YOURSELF</span>
            </div>
            <p>{c.activity}</p>
            <button
              className="text-link"
              onClick={() =>
                navigate(
                  chapterIndex === 2
                    ? 'visualizer'
                    : chapterIndex === 4
                      ? 'dataset'
                      : chapterIndex === 6
                        ? 'evaluate'
                        : 'lab',
                )
              }
            >
              Open an interactive tool <ArrowRight size={16} />
            </button>
          </div>
          <div className="quiz-card">
            <div className="quiz-top">
              <span>
                <GraduationCap size={18} /> KNOWLEDGE CHECK
              </span>
              <MiniTag>1 QUESTION</MiniTag>
            </div>
            <h3>{c.quiz.q}</h3>
            <div className="quiz-options">
              {c.quiz.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setQuizAnswers((p) => ({ ...p, [c.id]: i }))}
                  className={`quiz-option ${ans === i ? 'chosen' : ''} ${ans !== undefined && i === c.quiz.correct ? 'correct' : ''} ${ans === i && i !== c.quiz.correct ? 'incorrect' : ''}`}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {option}
                  {ans !== undefined && i === c.quiz.correct && (
                    <Check size={17} />
                  )}
                </button>
              ))}
            </div>
            {ans !== undefined && (
              <div
                className={`quiz-feedback ${ans === c.quiz.correct ? 'pass' : 'try'}`}
              >
                <strong>
                  {ans === c.quiz.correct
                    ? 'Correct.'
                    : 'Not quite. Try again.'}
                </strong>
                <p>{c.quiz.why}</p>
              </div>
            )}
          </div>
          <div className="lesson-actions">
            <button
              className={`button ${isDone ? 'outline' : 'primary'}`}
              onClick={() => toggleDone(c.id)}
            >
              {isDone ? (
                <>
                  <Check size={17} /> Marked complete
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} /> Mark lesson complete
                </>
              )}
            </button>
            <button
              className="button outline"
              onClick={() =>
                setChapterIndex((chapterIndex + 1) % chapters.length)
              }
            >
              Next chapter <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <aside className="lesson-aside">
          <div className="aside-card">
            <div className="eyebrow">COURSE CONTENTS</div>
            <div className="aside-chapters">
              {chapters.map((chapter, i) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setChapterIndex(i);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={i === chapterIndex ? 'active' : ''}
                >
                  <span>
                    {done.includes(chapter.id) ? (
                      <Check size={13} />
                    ) : (
                      chapter.chapter
                    )}
                  </span>
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>
          <div className="aside-note">
            <Sparkles size={20} />
            <strong>Small steps matter.</strong>
            <p>
              You can finish this chapter before running anything. The cloud GPU
              is only needed for the real Colab lab.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export { LessonPage };
