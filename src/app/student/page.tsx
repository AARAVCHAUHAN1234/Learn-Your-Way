'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storageService';
import { Lesson, UserPreferences } from '@/lib/types';
import {
  BookOpen,
  Sparkles,
  Volume2,
  Globe2,
  FileText,
  HelpCircle,
  Eye,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, { completed: boolean; formatsUsed: string[] }>>({});

  useEffect(() => {
    setLessons(StorageService.getLessons());
    setPreferences(StorageService.getPreferences());
    setProgressMap(StorageService.getProgress());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wide mb-3 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Inclusive Student Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome to Your Learning Space
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6">
            Every lesson is accessible in the way you learn best—whether you prefer listening to clear audio, reading simplified explanations, studying visual diagrams, or exploring in your preferred language.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/settings/accessibility"
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>
                Preferences: {preferences?.preferredLanguage === 'hi' ? 'Hindi (हिन्दी)' : 'English'} •{' '}
                {preferences?.simplifiedText ? 'Simplified' : 'Standard'}
              </span>
            </Link>

            <Link
              href="/student/lessons/lesson-photosynthesis-demo"
              className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 border border-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
            >
              <span>Explore Photosynthesis Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Available Lessons Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Available Learning Materials</h2>
            <p className="text-xs text-slate-500">
              Select any lesson below to view its personalized multi-format learning options.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'} Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const progress = progressMap[lesson.id];
            const hasSimplified = Boolean(lesson.simplifiedText);
            const hasHindi = Boolean(lesson.translations?.hi);
            const hasDiagrams = Boolean(lesson.diagrams && lesson.diagrams.length > 0);
            const hasQuiz = Boolean(lesson.quiz && lesson.quiz.length > 0);

            return (
              <div
                key={lesson.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                      {lesson.subject || 'General Science'}
                    </span>
                    {lesson.isSample && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                        Official Demo
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    <Link
                      href={`/student/lessons/${lesson.id}`}
                      className="hover:text-indigo-600 transition"
                    >
                      {lesson.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {lesson.description || lesson.sourceText.slice(0, 150) + '...'}
                  </p>

                  {/* Available Accessible Formats Badges */}
                  <div className="mb-6 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Available Accessible Formats:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                        <FileText className="w-3 h-3 text-slate-500" />
                        Original
                      </span>
                      {hasSimplified && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                          <BookOpen className="w-3 h-3 text-emerald-600" />
                          Simplified
                        </span>
                      )}
                      {hasHindi && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-sky-50 text-sky-700 rounded-md">
                          <Globe2 className="w-3 h-3 text-sky-600" />
                          Hindi
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                        <Volume2 className="w-3 h-3 text-indigo-600" />
                        Audio
                      </span>
                      {hasDiagrams && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-purple-50 text-purple-700 rounded-md">
                          <Eye className="w-3 h-3 text-purple-600" />
                          Visual Desc
                        </span>
                      )}
                      {hasQuiz && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-amber-50 text-amber-700 rounded-md">
                          <HelpCircle className="w-3 h-3 text-amber-600" />
                          Quiz
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    {progress?.completed ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : progress?.formatsUsed?.length ? (
                      <span className="text-indigo-600 font-medium">
                        {progress.formatsUsed.length} formats explored
                      </span>
                    ) : (
                      <span>Not started</span>
                    )}
                  </div>

                  <Link
                    href={`/student/lessons/${lesson.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <span>Open Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
