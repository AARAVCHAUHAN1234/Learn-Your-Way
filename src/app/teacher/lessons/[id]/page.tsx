'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { StorageService } from '@/lib/storageService';
import { Lesson } from '@/lib/types';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  BookOpen,
  Globe2,
  HelpCircle,
  Eye,
  FileText,
  ExternalLink,
} from 'lucide-react';

export default function TeacherLessonEditPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'simplified' | 'hindi' | 'diagram' | 'quiz'>('details');

  // Editable fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [foundationalText, setFoundationalText] = useState('');
  const [intermediateText, setIntermediateText] = useState('');
  const [hindiText, setHindiText] = useState('');
  const [diagramDescription, setDiagramDescription] = useState('');
  const [diagramInterpretation, setDiagramInterpretation] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    const item = StorageService.getLessonById(lessonId);
    if (item) {
      setLesson(item);
      setTitle(item.title);
      setSubject(item.subject || '');
      setGradeLevel(item.gradeLevel || '');
      setFoundationalText(item.simplifiedText?.foundational || '');
      setIntermediateText(item.simplifiedText?.intermediate || '');
      setHindiText(item.translations?.hi || '');
      if (item.diagrams && item.diagrams[0]) {
        setDiagramDescription(item.diagrams[0].detailedDescription || '');
        setDiagramInterpretation(item.diagrams[0].scientificInterpretation || '');
      }
    }
  }, [lessonId]);

  const handleSave = () => {
    if (!lesson) return;

    const updated: Lesson = {
      ...lesson,
      title,
      subject,
      gradeLevel,
      updatedAt: new Date().toISOString(),
      simplifiedText: {
        foundational: foundationalText,
        intermediate: intermediateText,
      },
      translations: {
        ...lesson.translations,
        hi: hindiText,
      },
      diagrams: lesson.diagrams?.length
        ? [
            {
              ...lesson.diagrams[0],
              detailedDescription: diagramDescription,
              scientificInterpretation: diagramInterpretation,
            },
            ...lesson.diagrams.slice(1),
          ]
        : [],
    };

    StorageService.saveLesson(updated);
    setLesson(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/teacher')}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Teacher Review & Approval Studio
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {title || 'Edit Lesson'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/student/lessons/${lesson.id}`}
            target="_blank"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Student View</span>
          </Link>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Approve</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>All revisions saved successfully. Student view has been refreshed.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'details', label: 'Overview & Metadata', icon: FileText },
          { id: 'simplified', label: 'Simplified Texts', icon: BookOpen },
          { id: 'hindi', label: 'Hindi Translation', icon: Globe2 },
          { id: 'diagram', label: 'Visual Diagram & Alt-Text', icon: Eye },
          { id: 'quiz', label: 'Quiz Questions', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Details */}
      {activeTab === 'details' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Grade Level
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Source Original Content (Read Only)
            </label>
            <textarea
              rows={8}
              readOnly
              value={lesson.sourceText}
              className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Simplified Text Edit */}
      {activeTab === 'simplified' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Foundational Reading Level (Early readers & basic analogies)
            </label>
            <textarea
              rows={6}
              value={foundationalText}
              onChange={(e) => setFoundationalText(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed font-normal"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Intermediate Reading Level (Structured explanations with technical terms)
            </label>
            <textarea
              rows={6}
              value={intermediateText}
              onChange={(e) => setIntermediateText(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed font-normal"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Hindi Translation */}
      {activeTab === 'hindi' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sky-800 mb-1">
              Hindi Educational Translation
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Verify accuracy of terminology and scientific concepts in Hindi.
            </p>
            <textarea
              rows={12}
              value={hindiText}
              onChange={(e) => setHindiText(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-loose"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Diagram Description */}
      {activeTab === 'diagram' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-800 mb-1">
              Spatial / Screen-Reader Detailed Description
            </label>
            <p className="text-xs text-slate-500 mb-2">
              For students using assistive audio or braille readers who cannot view graphic diagrams.
            </p>
            <textarea
              rows={6}
              value={diagramDescription}
              onChange={(e) => setDiagramDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-800 mb-1">
              Scientific Concept Grounding
            </label>
            <textarea
              rows={4}
              value={diagramInterpretation}
              onChange={(e) => setDiagramInterpretation(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 5: Quiz Questions */}
      {activeTab === 'quiz' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Generated Quiz Questions ({lesson.quiz?.length || 0})
          </h3>
          <div className="space-y-4">
            {lesson.quiz?.map((q, idx) => (
              <div key={q.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                <p className="font-bold text-slate-800">Q{idx + 1}: {q.question}</p>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border ${
                        oIdx === q.correctIndex
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {opt} {oIdx === q.correctIndex && '✓ (Correct)'}
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 italic mt-2">Explanation: {q.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
