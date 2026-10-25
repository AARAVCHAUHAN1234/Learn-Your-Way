'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/lib/storageService';
import { Lesson } from '@/lib/types';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function UploadWorkflowPage() {
  const router = useRouter();

  // Workflow steps: 1: Upload, 2: Extract & Inspect/Edit, 3: Generate Transformations, 4: Complete
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Science');
  const [gradeLevel, setGradeLevel] = useState('Grade 7');
  const [extractedText, setExtractedText] = useState('');
  const [filename, setFilename] = useState('');
  const [extractedImageBase64, setExtractedImageBase64] = useState<string | undefined>(undefined);

  // Processing indicators
  const [isExtracting, setIsExtracting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [providerUsed, setProviderUsed] = useState<string>('');

  // Transformed outputs
  const [createdLessonId, setCreatedLessonId] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setIsExtracting(true);
    setFilename(file.name);

    if (!title) {
      // Suggest title from filename
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      // Store extracted image if available
      if (data.imageBase64) {
        setExtractedImageBase64(data.imageBase64);
      }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract text from document.');
      }

      setExtractedText(data.extractedText || '');
      setStep(2);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error processing file.';
      setErrorMessage(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleUseSampleText = () => {
    setTitle('Water Cycle: Evaporation, Condensation and Precipitation');
    setSubject('Earth & Environmental Science');
    setGradeLevel('Grade 6 - 8');
    setFilename('Water_Cycle_Lesson.pdf');
    setExtractedText(`The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above, and below the surface of the Earth. 

Solar energy powers this endless global circulation:
1. Evaporation: Heat from the sun warms oceans, lakes, and rivers, converting liquid water into water vapor that ascends into the atmosphere. Plants also release water vapor via transpiration.
2. Condensation: As water vapor rises into cooler high altitudes, it cools and coalesces into microscopic water droplets and ice crystals, forming clouds and fog.
3. Precipitation: When cloud droplets become too heavy to remain suspended in air currents, gravity pulls them down as rain, snow, sleet, or hail.
4. Collection & Runoff: Precipitated water collects in oceans, rivers, and aquifers (groundwater), completing the cycle to be heated again by the sun.

This vital atmospheric process redistributes freshwater globally, moderates planetary climate, and sustains agricultural and terrestrial ecosystems.`);
    setStep(2);
  };

  const handleGenerateTransformations = async () => {
    if (!extractedText.trim()) {
      setErrorMessage('Please provide lesson text before transforming.');
      return;
    }

    setIsTransforming(true);
    setErrorMessage('');
    setStep(3);

    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          text: extractedText,
          imageBase64: extractedImageBase64,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to generate transformations.');
      }

      const generated = result.data;
      setProviderUsed(result.provider === 'llm' ? `Live AI Model (${result.modelUsed})` : 'Deterministic Inclusive Engine');

      const newLessonId = 'lesson-' + Date.now();
      const newLesson: Lesson = {
        id: newLessonId,
        title: title || 'Curriculum Lesson',
        subject,
        gradeLevel,
        description: extractedText.slice(0, 160) + '...',
        sourceFilename: filename || 'custom_lesson.pdf',
        sourceText: extractedText,
        processingStatus: 'ready',
        isSample: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        simplifiedText: {
          foundational: generated.simplifiedFoundational,
          intermediate: generated.simplifiedIntermediate,
        },
        translations: {
          hi: generated.hindiTranslation,
        },
        diagrams: [
          {
            id: 'diag-' + Date.now(),
            title: generated.diagramDescription.title,
            imageUrl: extractedImageBase64,
            altText: generated.diagramDescription.altText,
            detailedDescription: generated.diagramDescription.detailedDescription,
            keyVisualElements: generated.diagramDescription.keyVisualElements,
            scientificInterpretation: generated.diagramDescription.scientificInterpretation,
            svgDiagram: generated.diagramDescription.svgDiagram,
          },
        ],
        quiz: generated.quiz,
        transcript: {
          fullText: `Audio overview for ${title}: ${extractedText.slice(0, 300)}...`,
          captions: [
            { start: 0, end: 5, text: `Overview of ${title}.` },
            { start: 5, end: 12, text: 'Essential concepts, cycles, and outcomes explained.' },
          ],
        },
      };

      StorageService.saveLesson(newLesson);
      setCreatedLessonId(newLessonId);
      setStep(4);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error executing transformations.';
      setErrorMessage(msg);
      setStep(2);
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* Workflow Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <BookOpen className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Automated Multi-Format Converter
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Process Educational Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload any PDF or paste raw text. The platform will extract content, let you edit it, and synthesize accessible formats.
        </p>
      </div>

      {/* Steps Pill Bar */}
      <div className="flex items-center justify-between p-2 bg-slate-100 rounded-2xl mb-8 text-xs font-semibold text-slate-500">
        <span className={`px-3 py-1.5 rounded-xl ${step === 1 ? 'bg-white text-indigo-700 shadow-sm' : ''}`}>
          1. Upload Source
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        <span className={`px-3 py-1.5 rounded-xl ${step === 2 ? 'bg-white text-indigo-700 shadow-sm' : ''}`}>
          2. Inspect & Edit Text
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        <span className={`px-3 py-1.5 rounded-xl ${step === 3 ? 'bg-white text-indigo-700 shadow-sm' : ''}`}>
          3. AI Conversion
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        <span className={`px-3 py-1.5 rounded-xl ${step === 4 ? 'bg-white text-emerald-700 shadow-sm' : ''}`}>
          4. Ready to Publish
        </span>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-8 text-center transition">
            <UploadCloud className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Select or Drag Educational PDF/Text File
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              Supported formats: .pdf (selectable or scanned text) or .txt files (up to 15MB).
            </p>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition">
              <span>{isExtracting ? 'Extracting Text...' : 'Browse Local File'}</span>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                disabled={isExtracting}
                className="hidden"
              />
            </label>

            {isExtracting && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-indigo-700 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reading PDF document structure and text tokens...</span>
              </div>
            )}
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or Try Demo Preset
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Preset Sample: Water Cycle Chapter</h4>
              <p className="text-xs text-slate-500">
                Immediately test the end-to-end extraction and AI conversion without preparing a file.
              </p>
            </div>
            <button
              onClick={handleUseSampleText}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shrink-0"
            >
              Load Water Cycle Sample
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Inspect & Edit Extracted Text */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Lesson Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cellular Respiration"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subject Area
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Biology"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Extracted Lesson Content (Editable)
              </label>
              <span className="text-[11px] text-slate-400">
                {extractedText.length} characters • {extractedText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Verify accuracy. Teachers can edit text, headings, or formulas before transformations are generated.
            </p>
            <textarea
              rows={12}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Back to Upload
            </button>

            <button
              onClick={handleGenerateTransformations}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Accessible Formats</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Transformation Loading */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Synthesizing Inclusive Experiences</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Generating foundational and intermediate simplified explanations, Hindi translation, visual diagram annotations, and concept quiz questions...
          </p>
        </div>
      )}

      {/* Step 4: Finished and Approved */}
      {step === 4 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Transformations Ready!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Processed via: <span className="font-semibold text-slate-700">{providerUsed}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-800">✓ Simplified Text</span>
              <p className="text-[10px] text-emerald-600 mt-0.5">2 reading levels</p>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
              <span className="text-[11px] font-bold text-sky-800">✓ Hindi Translation</span>
              <p className="text-[10px] text-sky-600 mt-0.5">Terminology preserved</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
              <span className="text-[11px] font-bold text-purple-800">✓ Visual Diagram</span>
              <p className="text-[10px] text-purple-600 mt-0.5">Screen-reader description</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-[11px] font-bold text-amber-800">✓ Practice Quiz</span>
              <p className="text-[10px] text-amber-600 mt-0.5">5 Questions & Explanations</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => router.push(`/student/lessons/${createdLessonId}`)}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>View as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => router.push('/teacher')}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Go to Teacher Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
