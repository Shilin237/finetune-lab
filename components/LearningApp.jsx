'use client';

import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleHelp,
  Database,
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  Terminal,
  X,
} from 'lucide-react';
import { chapters, glossary } from '@/data/lessonData';
import labSteps from '@/data/labSteps.json';
import { ProgressMeter } from './ui';
import { Overview } from './pages/Overview';
import { LessonPage } from './pages/LessonPage';
import { LabPage } from './pages/LabPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { DatasetPage } from './pages/DatasetPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { GlossaryPage } from './pages/GlossaryPage';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'lessons', label: 'Learning path', icon: BookOpen },
  { id: 'lab', label: 'Colab lab', icon: Terminal },
  { id: 'visualizer', label: 'Visual explorer', icon: BrainCircuit },
  { id: 'dataset', label: 'Dataset studio', icon: Database },
  { id: 'evaluate', label: 'Evaluation studio', icon: BarChart3 },
  { id: 'glossary', label: 'Glossary', icon: CircleHelp },
];

export default function LearningApp() {
  const [section, setSection] = useState('overview');
  const [chapterIndex, setChapterIndex] = useState(0);
  const [labIndex, setLabIndex] = useState(0);
  const [done, setDone] = useState([]);
  const [labDone, setLabDone] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem('ftl_lessons') || '[]'));
      setLabDone(JSON.parse(localStorage.getItem('ftl_lab') || '[]'));
      setQuizAnswers(JSON.parse(localStorage.getItem('ftl_quiz') || '{}'));
    } catch {}
    setReady(true);
    const hash = location.hash.slice(1);
    if (NAV.some((n) => n.id === hash)) setSection(hash);
  }, []);
  useEffect(() => {
    if (ready) {
      localStorage.setItem('ftl_lessons', JSON.stringify(done));
      localStorage.setItem('ftl_lab', JSON.stringify(labDone));
      localStorage.setItem('ftl_quiz', JSON.stringify(quizAnswers));
    }
  }, [ready, done, labDone, quizAnswers]);
  const navigate = (next) => {
    setSection(next);
    setMobileOpen(false);
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${next}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const toggleDone = (id, lab = false) => {
    if (lab) {
      setLabDone((p) =>
        p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
      );
    } else {
      setDone((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    }
  };
  const totalCompletion = Math.round(
    ((done.length + labDone.length) / (chapters.length + labSteps.length)) *
      100,
  );
  return (
    <div className="site-shell">
      {mobileOpen && (
        <button
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">
            <div className="brand-mark">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div>
            <strong>
              finetune<span>.lab</span>
            </strong>
            <small>THE HANDS-ON PLAYBOOK</small>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="side-divider" />
        <div className="nav-caption">WORKSPACE</div>
        <nav aria-label="Main navigation" className="nav-group">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              className={`nav-item ${section === id ? 'active' : ''}`}
              key={id}
              onClick={() => navigate(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {section === id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>
        <div className="side-divider" />
        <div className="nav-caption">YOUR COURSE</div>
        <div className="sidebar-lessons">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                setChapterIndex(i);
                navigate('lessons');
              }}
              className={`sidebar-lesson ${section === 'lessons' && chapterIndex === i ? 'current' : ''}`}
            >
              <span
                className={`lesson-number ${done.includes(c.id) ? 'finished' : ''}`}
              >
                {done.includes(c.id) ? <Check size={11} /> : c.chapter}
              </span>
              <span>{c.title}</span>
            </button>
          ))}
        </div>
        <div className="side-bottom">
          <div className="sidebar-progress-head">
            <span>YOUR PROGRESS</span>
            <b>{totalCompletion}%</b>
          </div>
          <ProgressMeter value={totalCompletion} />
          <p>
            {done.length} / 8 lessons · {labDone.length} / 14 lab steps
          </p>
          <a href="/downloads/complete-handbook.docx" download>
            <FileText size={15} /> Original 18-page handbook{' '}
            <Download size={14} />
          </a>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-trigger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <span className="crumb-start">COURSE</span>
            <ChevronRight size={14} />
            <span className="crumb-current">
              {NAV.find((n) => n.id === section)?.label}
            </span>
          </div>
          <div className="topbar-right">
            <span className="status-dot" />{' '}
            <span className="topbar-state">SELF-PACED COURSE</span>
            <span className="topbar-separator" />
            <span className="topbar-completed">{done.length} OF 8 LESSONS</span>
            <div className="avatar">FL</div>
          </div>
        </header>
        <main className="content">
          {section === 'overview' && (
            <Overview
              navigate={navigate}
              setChapterIndex={setChapterIndex}
              totalCompletion={totalCompletion}
              done={done}
            />
          )}
          {section === 'lessons' && (
            <LessonPage
              chapterIndex={chapterIndex}
              setChapterIndex={setChapterIndex}
              done={done}
              toggleDone={toggleDone}
              quizAnswers={quizAnswers}
              setQuizAnswers={setQuizAnswers}
              navigate={navigate}
            />
          )}
          {section === 'lab' && (
            <LabPage
              labIndex={labIndex}
              setLabIndex={setLabIndex}
              labDone={labDone}
              toggleDone={toggleDone}
            />
          )}
          {section === 'visualizer' && <VisualizerPage />}
          {section === 'dataset' && <DatasetPage />}
          {section === 'evaluate' && <EvaluationPage />}
          {section === 'glossary' && <GlossaryPage />}
        </main>
        <footer className="page-footer">
          <span>
            <span className="footer-icon">◈</span> FINETUNE.LAB / LEARN BY
            BUILDING
          </span>
          <span>
            Educational simulations are not real GPU benchmarks ·{' '}
            <a
              href="https://unsloth.ai/docs/get-started/unsloth-notebooks"
              target="_blank"
              rel="noreferrer"
            >
              Official docs <ArrowUpRight size={12} />
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}

export { NAV };
