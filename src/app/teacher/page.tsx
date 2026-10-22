'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StorageService } from '@/lib/storageService';
import { Lesson, QuizAttempt } from '@/lib/types';
import {
  BookOpen,
  PlusCircle,
  FileText,
  BarChart3,
  HelpCircle,
  Sparkles,
  Trash2,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    setLessons(StorageService.getLessons());
    setQuizAttempts(StorageService.getQuizAttempts());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this lesson? (Sample lesson is preserved)')) {
      StorageService.deleteLesson(id);
      setLessons(StorageService.getLessons());
    }
  };

  // Metrics calculation
  const totalLessons = lessons.length;
  const totalTransformations = lessons.reduce((acc, l) => {
    let count = 1; // original
    if (l.simplifiedText) count++;
    if (l.translations?.hi) count++;
    if (l.diagrams?.length) count++;
    if (l.quiz?.length) count++;
    return acc + count;
  }, 0);

  const totalAttempts = quizAttempts.length;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          (quizAttempts.reduce((acc, a) => acc + (a.score / a.totalQuestions) * 100, 0) /
            totalAttempts)
        )
      : 84;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Teacher Studio & Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Educator Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload curriculum materials once. Review and approve accessible multi-format outputs for all learners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/teacher/upload"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Process New Lesson</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Lessons
            </span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{totalLessons}</p>
          <p className="text-[11px] text-slate-500 mt-1">Uploaded & curated curriculum items</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Accessible Formats
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-700">{totalTransformations}</p>
          <p className="text-[11px] text-slate-500 mt-1">Audio, simplified, Hindi & visual items</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quiz Submissions
            </span>
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-700">{totalAttempts}</p>
          <p className="text-[11px] text-slate-500 mt-1">Student practice completions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Class Average Score
            </span>
            <BarChart3 className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-3xl font-extrabold text-sky-700">{averageScore}%</p>
          <p className="text-[11px] text-slate-500 mt-1">On conceptual practice checkpoints</p>
        </div>
      </div>

      {/* Lesson Management Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Curriculum Lesson Roster</h2>
            <p className="text-xs text-slate-500">Manage lesson transformations, preview student perspectives, or remove content.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-3.5">Lesson Title</th>
                <th scope="col" className="px-6 py-3.5">Subject & Level</th>
                <th scope="col" className="px-6 py-3.5">Available Formats</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span>{lesson.title}</span>
                      {lesson.isSample && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                          Sample
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5 truncate">
                      {lesson.sourceFilename || 'Text Document'}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs">
                    <div className="font-medium text-slate-800">{lesson.subject || 'General'}</div>
                    <div className="text-slate-400">{lesson.gradeLevel || 'Standard'}</div>
                  </td>

                  <td className="px-6 py-4 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {lesson.simplifiedText && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[11px]">Simplified</span>
                      )}
                      {lesson.translations?.hi && (
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-[11px]">Hindi</span>
                      )}
                      {lesson.diagrams?.length ? (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[11px]">Visuals</span>
                      ) : null}
                      {lesson.quiz?.length ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[11px]">Quiz ({lesson.quiz.length}Q)</span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Approved
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/teacher/lessons/${lesson.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                    >
                      <span>Review / Edit</span>
                    </Link>

                    <Link
                      href={`/student/lessons/${lesson.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition"
                      target="_blank"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Student View</span>
                    </Link>

                    {!lesson.isSample && (
                      <button
                        onClick={(e) => handleDelete(lesson.id, e)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
