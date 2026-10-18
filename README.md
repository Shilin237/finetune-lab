# FineTune Lab

An interactive beginner-first course for learning LLM fine tuning with **Qwen3 0.6B, Google Colab, Unsloth and Ollama**.

## What is included

- Eight detailed lessons with analogies, explanations, exercises and quizzes
- Fourteen runnable Colab notebook stages, annotated with purpose, code, expected result, verification and troubleshooting
- Clickable training pipeline and LoRA visualisation
- Educational GPU memory explorer and clearly labelled loss simulations
- Browser-based dataset builder with separate training/test examples and JSONL import/export
- Evaluation studio for pasting real before/after results, scoring and exporting CSV
- Glossary and official references
- Progress saved in this browser with localStorage
- Original handbook and `.ipynb` notebook in `public/downloads`

## Run the website

Prerequisites: Node.js 20.9+ and npm. Internet access is required for the first dependency installation.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For an optimized build:

```bash
npm run build
npm run start
```

## Deploy

Push the folder to a Git repository. On Vercel choose **Import Project**, select the repository and deploy with Next.js defaults. No environment variables, accounts or backend services are required for this version. You can also deploy to any host that supports Next.js 15.

## How to do the real training

1. From the website, download `qwen-unsloth-lab.ipynb`.
2. Visit https://colab.research.google.com and upload that notebook.
3. Select **Runtime → Change runtime type → GPU** if a GPU is available.
4. Follow all 14 stages and read the explanations inside FineTune Lab. The optional last stage exports GGUF for Ollama.
5. Paste actual before and after responses into the Evaluation Studio to compare them.

**The website does not run PyTorch training in the browser.** Interactive pipeline, memory and loss visualisations are educational. The actual GPU work happens in Google Colab.

## Local data and privacy

Progress, draft dataset examples and evaluation results use the current browser's `localStorage` and are **not synchronised to a server**. Browser clearing removes them. Use JSONL/CSV export to back up your work. Do not paste confidential company documents or secrets into public cloud training workflows.

## Package and accuracy notes

This project was prepared in a sandbox without access to npm's package registry, so a full `npm install && npm run build` could not be executed here. Install dependencies and run the build on your machine. Google Colab GPU availability, model links, Python/TRL APIs and Unsloth support can change; start from the included notebook and check the official documentation if a package version is incompatible.

The model size slider uses an approximate raw-weight formula and teaching-only inference overhead. It does not estimate fine tuning training memory or guarantee fit. The loss plot is simulated and never represents benchmark measurements.

## Structure

```text
app/
  layout.jsx
  page.jsx
  globals.css
components/
  LearningApp.jsx
data/
  lessonData.js
  labSteps.json
public/
  downloads/
    complete-handbook.docx
    qwen-unsloth-lab.ipynb
  illustrations/
    tool-stack.svg
    lora-architecture.svg
scripts/
  check-content.mjs
start-windows.bat
```

## Credits / official references

- https://colab.research.google.com/
- https://unsloth.ai/docs/get-started/unsloth-notebooks
- https://unsloth.ai/docs/models/tutorials/qwen3-how-to-run-and-fine-tune
- https://huggingface.co/docs/trl/sft_trainer
- https://docs.ollama.com/modelfile

### Windows shortcut

If you prefer, after unzipping the project you can double-click `start-windows.bat`. It checks Node.js, installs dependencies if missing, and launches the development server. Leave that command window open while using the site.

### Content test

```bash
npm run check:content
```

This checks the fourteen explained notebook cells against the copy of the actual `.ipynb` shipped with the project.

### Using Dataset Studio exports in Colab

Open **Dataset Studio** inside the website and download both JSONL files. Expand the optional **Use your own exported examples** section for the Colab replacement cell. Replace **cell 05** in the bundled notebook, then continue with cell 06. Test examples stay outside the training dataset.
