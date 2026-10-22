'use client';

import React, { useState, useEffect } from 'react';
import { UserPreferences } from '@/lib/types';
import { StorageService, DEFAULT_PREFERENCES } from '@/lib/storageService';
import { Settings, Check, Volume2, BookOpen, Globe2, Eye, HelpCircle, FileText } from 'lucide-react';

export default function AccessibilitySettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    setPreferences(StorageService.getPreferences());
  }, []);

  const handleToggle = (key: keyof UserPreferences) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    StorageService.savePreferences(updated);
    triggerSaved();
  };

  const handleSelect = (key: keyof UserPreferences, value: unknown) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    StorageService.savePreferences(updated);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Learner Agency & Inclusivity
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Accessibility & Learning Preferences
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Customize how lessons are presented to you by default. These are voluntary learning preferences designed to support your personal pace and style—never medical diagnoses or labels.
        </p>
      </div>

      {savedAlert && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in"
        >
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated and saved to your device.</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Preferred Language */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
              <Globe2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-slate-900">Preferred Lesson Language</h2>
              <p className="text-xs text-slate-600 mb-4">
                When a lesson has been translated, it will open in this language automatically.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { code: 'en', label: 'English', native: 'English' },
                  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
                  { code: 'es', label: 'Spanish', native: 'Español' },
                  { code: 'fr', label: 'French', native: 'Français' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect('preferredLanguage', lang.code)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      preferences.preferredLanguage === lang.code
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs text-slate-500">{lang.label}</span>
                    <span className="text-sm font-bold mt-1">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Format Delivery Preferences */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1">Default Learning Formats</h2>
          <p className="text-xs text-slate-600 mb-5">
            Select the modalities you find most helpful when opening any lesson.
          </p>

          <div className="space-y-4">
            {[
              {
                id: 'simplifiedText',
                icon: BookOpen,
                title: 'Prioritize Simplified Text',
                desc: 'Opens the clear, plain-language version first with step-by-step concepts.',
              },
              {
                id: 'readAloud',
                icon: Volume2,
                title: 'Auto-Highlight Read Aloud Narration',
                desc: 'Features assistive audio playback immediately upon opening lessons.',
              },
              {
                id: 'visualDescriptions',
                icon: Eye,
                title: 'Tactile & Visual Diagram Descriptions',
                desc: 'Opens detailed verbal descriptions for scientific figures and visual diagrams.',
              },
              {
                id: 'captionsAndTranscripts',
                icon: FileText,
                title: 'Captions & Transcripts View',
                desc: 'Shows synchronized spoken transcripts alongside lesson media.',
              },
              {
                id: 'additionalPractice',
                icon: HelpCircle,
                title: 'Interactive Practice Checkpoint',
                desc: 'Recommends self-assessment questions and explanations prominently.',
              },
            ].map((item) => {
              const Icon = item.icon;
              const isChecked = Boolean(preferences[item.id as keyof UserPreferences]);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 text-slate-700 rounded-lg mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-600">{item.desc}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isChecked}
                    onClick={() => handleToggle(item.id as keyof UserPreferences)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                      isChecked ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isChecked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Reading Level Configuration */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1">Simplification Level Setting</h2>
          <p className="text-xs text-slate-600 mb-4">
            Select the default readability depth for generated simplified versions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'foundational',
                title: 'Foundational (Introductory)',
                desc: 'Everyday vocabulary, short direct sentences, clear analogies.',
              },
              {
                id: 'intermediate',
                title: 'Intermediate (Structured)',
                desc: 'Preserves scientific terminology with contextual explanations.',
              },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => handleSelect('readingLevel', lvl.id)}
                className={`p-4 rounded-xl border text-left transition ${
                  preferences.readingLevel === lvl.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">{lvl.title}</span>
                  {preferences.readingLevel === lvl.id && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-xs text-slate-600">{lvl.desc}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
