import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Volume2,
  Globe2,
  Eye,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Team VSARN • Hackathon MVP</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          One lesson.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600">
            Every learner.
          </span>{' '}
          Their way.
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Standard textbook PDFs don’t fit every mind. A teacher uploads curriculum material once—and students can read simplified text, listen to audio narration, view diagram descriptions, learn in Hindi, or practice quizzes.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/student/lessons/lesson-photosynthesis-demo"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>Try 60-Sec Demo (Photosynthesis)</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/teacher"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-base font-bold shadow-sm transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Teacher Studio</span>
          </Link>

          <Link
            href="/student"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-base font-bold shadow-sm transition flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>Student Dashboard</span>
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          No signups required to evaluate. WCAG 2.2 AA compliant. Offline demo ready.
        </p>
      </section>

      {/* Visual transformation demonstration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-12 text-white shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              The Inclusive Transformation Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              One Single Input Document ➔ Six Tailored Modalities
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Teachers don’t have time to create multiple manual adaptations. Our engine extracts the source text and prepares compliant accessible variants automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">Dual Reading Levels</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Foundational plain language and structured intermediate versions for learners with reading difficulties or ADHD.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-3">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">Vernacular Translation (Hindi)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accurate translation preserving critical scientific terminology, designed for multilingual education contexts in India.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-3">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">Read Aloud & Captions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero-credential client speech synthesis with speed control for visually impaired and auditory learners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">Visual & Diagram Descriptions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deep spatial descriptions distinguishing visual layout from scientific interpretation for non-sighted learners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">Interactive Concept Quizzes</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Self-assessment checkpoint with no answer leakage, accessible keyboard controls, and real-time score feedback.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">Human-in-the-Loop Review</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Teachers maintain complete oversight to verify and edit generated drafts before publishing to students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demonstration Banner for Judges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-indigo-600 text-white rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Judges Quick-Start Guide
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Evaluate the Complete Product in 60 Seconds
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              1. Click &quot;Try Demo&quot; to open the Photosynthesis module.<br />
              2. Switch tabs from Original ➔ Simplified ➔ हिन्दी (Hindi) ➔ Audio narration.<br />
              3. Check the Accessible Diagram description and complete the quiz.<br />
              4. Open Teacher Studio to inspect how educators upload and review content.
            </p>
          </div>

          <Link
            href="/student/lessons/lesson-photosynthesis-demo"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition whitespace-nowrap"
          >
            Launch Demo Lesson
          </Link>
        </div>
      </section>
    </div>
  );
}
