'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { StorageService } from '@/lib/storageService';
import { Lesson, UserPreferences } from '@/lib/types';
import { TTSPlayer } from '@/components/TTSPlayer';
import { QuizViewer } from '@/components/QuizViewer';
import { AccessibleDiagramViewer } from '@/components/AccessibleDiagramViewer';
import {
  FileText,
  BookOpen,
  Globe2,
  Volume2,
  Eye,
  HelpCircle,
  SlidersHorizontal,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Info,
} from 'lucide-react';

type TabFormat = 'simplified' | 'original' | 'hindi' | 'audio' | 'diagram' | 'quiz';

export default function LessonViewerPage() {
  const params = useParams();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [activeTab, setActiveTab] = useState<TabFormat>('simplified');
  const [readingLevel, setReadingLevel] = useState<'foundational' | 'intermediate'>('foundational');

  useEffect(() => {
    if (!lessonId) return;
    const found = StorageService.getLessonById(lessonId);
    if (found) {
      setLesson(found);
    }
    const prefs = StorageService.getPreferences();
    setPreferences(prefs);

    // Apply smart default format based on learner preferences!
    if (prefs.preferredLanguage === 'hi' && found?.translations?.hi) {
      setActiveTab('hindi');
    } else if (prefs.visualDescriptions && found?.diagrams?.length) {
      setActiveTab('diagram');
    } else if (prefs.readAloud) {
      setActiveTab('audio');
    } else if (prefs.additionalPractice && found?.quiz?.length) {
      setActiveTab('quiz');
    } else if (found?.simplifiedText) {
      setActiveTab('simplified');
    } else {
      setActiveTab('original');
    }

    if (prefs.readingLevel) {
      setReadingLevel(prefs.readingLevel === 'intermediate' ? 'intermediate' : 'foundational');
    }
  }, [lessonId]);

  const handleTabChange = (tab: TabFormat) => {
    setActiveTab(tab);
    if (lessonId) {
      StorageService.recordFormatAccessed(lessonId, tab);
    }
  };

  const handleQuizCompleted = (score: number, total: number) => {
    if (!lessonId) return;
    StorageService.saveQuizAttempt({
      id: 'att-' + Date.now(),
      lessonId,
      learnerId: 'student-session',
      score,
      totalQuestions: total,
      answers: [],
      completedAt: new Date().toISOString(),
    });
  };

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Lesson Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">The requested lesson could not be located in your local repository.</p>
        <Link
          href="/student"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Return to Student Workspace
        </Link>
      </div>
    );
  }

  // Determine which text should be read aloud if in audio tab
  const activeNarrationText =
    activeTab === 'hindi' && lesson.translations?.hi
      ? lesson.translations.hi
      : activeTab === 'simplified' && lesson.simplifiedText
      ? lesson.simplifiedText[readingLevel]
      : lesson.sourceText;

  const currentSpeechLang = activeTab === 'hindi' ? 'hi' : 'en';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Top back navigation & context bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            aria-label="Back to all lessons"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                {lesson.subject || 'Curriculum Lesson'}
              </span>
              {lesson.isSample && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                  Demonstration Lesson
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {lesson.title}
            </h1>
          </div>
        </div>

        <Link
          href="/settings/accessibility"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Tune Preferences</span>
        </Link>
      </div>

      {/* Accessible Format Selector Tabs */}
      <nav
        aria-label="Accessible Lesson Formats"
        className="flex flex-wrap items-center gap-2 mb-6 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200"
      >
        <button
          onClick={() => handleTabChange('simplified')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'simplified'
              ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'simplified' ? 'true' : undefined}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Simplified Text</span>
        </button>

        <button
          onClick={() => handleTabChange('hindi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'hindi'
              ? 'bg-white text-sky-800 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'hindi' ? 'true' : undefined}
        >
          <Globe2 className="w-4 h-4 text-sky-600" />
          <span>हिन्दी (Hindi)</span>
        </button>

        <button
          onClick={() => handleTabChange('audio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'audio'
              ? 'bg-white text-indigo-800 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'audio' ? 'true' : undefined}
        >
          <Volume2 className="w-4 h-4 text-indigo-600" />
          <span>Listen Aloud</span>
        </button>

        <button
          onClick={() => handleTabChange('diagram')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'diagram'
              ? 'bg-white text-purple-800 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'diagram' ? 'true' : undefined}
        >
          <Eye className="w-4 h-4 text-purple-600" />
          <span>Visual & Diagram Description</span>
        </button>

        <button
          onClick={() => handleTabChange('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'quiz'
              ? 'bg-white text-amber-800 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'quiz' ? 'true' : undefined}
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Practice Quiz</span>
        </button>

        <button
          onClick={() => handleTabChange('original')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'original'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'original' ? 'true' : undefined}
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Original Text</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Integrated Read-Aloud Narration Player for instant audio */}
          <TTSPlayer
            textToRead={activeNarrationText}
            lang={currentSpeechLang}
            title={`${lesson.title} (${activeTab.toUpperCase()})`}
          />

          {/* Tab 1: Simplified Text */}
          {activeTab === 'simplified' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Simplified Reading Experience</h2>
                    <p className="text-xs text-slate-500">
                      Clear language preserving essential scientific concepts and accuracy.
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setReadingLevel('foundational')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      readingLevel === 'foundational'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Foundational
                  </button>
                  <button
                    onClick={() => setReadingLevel('intermediate')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      readingLevel === 'intermediate'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Intermediate
                  </button>
                </div>
              </div>

              {lesson.simplifiedText ? (
                <article className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base whitespace-pre-line font-normal">
                  {lesson.simplifiedText[readingLevel]}
                </article>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Simplified text is being prepared for this lesson.
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Hindi Translation */}
          {activeTab === 'hindi' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <span className="p-2 bg-sky-50 text-sky-700 rounded-xl">
                  <Globe2 className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">हिन्दी अनुवाद (Hindi Translation)</h2>
                  <p className="text-xs text-slate-500">
                    वैज्ञानिक शब्दावली और मुख्य संकल्पनाओं को सुरक्षित रखते हुए सुगम अनुवाद।
                  </p>
                </div>
              </div>

              {lesson.translations?.hi ? (
                <article className="prose prose-slate max-w-none text-slate-800 leading-loose text-base whitespace-pre-line font-normal">
                  {lesson.translations.hi}
                </article>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Hindi translation has not been configured yet for this custom lesson.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Dedicated Listen / Narration Mode */}
          {activeTab === 'audio' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Volume2 className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Audio Narration & Captions</h2>
                  <p className="text-xs text-slate-500">
                    Synchronized speech synthesis with caption highlights for multimodal learning.
                  </p>
                </div>
              </div>

              {lesson.transcript ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Lesson Audio Transcript
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {lesson.transcript.fullText}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Synchronized Segment Captions:
                    </h4>
                    {lesson.transcript.captions.map((cap, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3 hover:bg-slate-50 transition"
                      >
                        <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          0:{cap.start < 10 ? '0' : ''}{cap.start} - 0:{cap.end < 10 ? '0' : ''}{cap.end}
                        </span>
                        <p className="text-sm text-slate-800">{cap.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Click the Play Narration button above to listen to the entire lesson read aloud!
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Visual & Diagram Description */}
          {activeTab === 'diagram' && (
            <div>
              {lesson.diagrams && lesson.diagrams.length > 0 ? (
                <div className="space-y-6">
                  {lesson.diagrams.map((diag) => (
                    <AccessibleDiagramViewer
                      key={diag.id}
                      title={diag.title}
                      altText={diag.altText}
                      detailedDescription={diag.detailedDescription}
                      keyVisualElements={diag.keyVisualElements}
                      scientificInterpretation={diag.scientificInterpretation}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-sm">
                  No visual diagrams currently associated with this lesson.
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Practice Quiz */}
          {activeTab === 'quiz' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <QuizViewer
                questions={lesson.quiz || []}
                lessonTitle={lesson.title}
                onComplete={handleQuizCompleted}
              />
            </div>
          )}

          {/* Tab 6: Original Text */}
          {activeTab === 'original' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <span className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Original Lesson Document</h2>
                  <p className="text-xs text-slate-500">
                    Source text extracted from uploaded educational PDF or textbook chapter.
                  </p>
                </div>
              </div>

              <article className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm whitespace-pre-line font-mono bg-slate-50 p-6 rounded-2xl border border-slate-200">
                {lesson.sourceText}
              </article>
            </div>
          )}
        </div>

        {/* Sidebar: Lesson Metadata & Quick Accessible Actions */}
        <aside className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Multi-Format Navigation</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every learner retains information differently. You can toggle between formats at any point without losing your place.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Grade Level:</span>
                <span className="font-semibold text-slate-800">{lesson.gradeLevel || 'Standard'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Subject:</span>
                <span className="font-semibold text-slate-800">{lesson.subject || 'Science'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Source:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                  {lesson.sourceFilename || 'Uploaded PDF'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 text-indigo-900 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Teacher Verified</h4>
            </div>
            <p className="text-xs leading-relaxed text-indigo-800">
              The transformations for this lesson have been verified by an educator to ensure factual accuracy and terminology integrity.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Ready for inclusive study</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
