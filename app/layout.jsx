import './globals.css';

export const metadata = {
  title: 'FineTune Lab | Learn LLM fine tuning from zero',
  description: 'An interactive, beginner-first guide to fine tuning Qwen with Google Colab and Unsloth. Learn each step with visual diagrams, code, datasets and evaluations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
