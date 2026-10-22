'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/lib/types';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Award } from 'lucide-react';

interface QuizViewerProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  onComplete?: (score: number, total: number) => void;
}

export function QuizViewer({ questions, lessonTitle, onComplete }: QuizViewerProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-slate-600 text-sm">No practice questions generated yet for this lesson.</p>
      </div>
    );
  }

  const handleSelect = (qIdx: number, optionIdx: number) => {
    if (submitted) return; // Prevent changing answers after submission
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const score = calculateScore();
    if (onComplete) {
      onComplete(score, questions.length);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Concept Practice: {lessonTitle}</h3>
          <p className="text-xs text-slate-500">
            {submitted
              ? 'Results & Detailed Explanations'
              : `Answer all ${questions.length} questions to check your understanding.`}
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                percentage >= 80
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : percentage >= 50
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Score: {score} / {questions.length} ({percentage}%)</span>
            </span>
            <button
              onClick={handleRetry}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, qIdx) => {
          const isAnswered = selectedAnswers[qIdx] !== undefined;
          const chosen = selectedAnswers[qIdx];
          const isCorrect = submitted && chosen === q.correctIndex;
          const isWrong = submitted && isAnswered && chosen !== q.correctIndex;

          return (
            <fieldset
              key={q.id || qIdx}
              className={`p-5 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : isWrong
                    ? 'border-red-300 bg-red-50/40'
                    : 'border-slate-200 bg-white'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <legend className="text-sm font-semibold text-slate-900 mb-3 px-1">
                <span className="inline-block w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs text-center leading-6 font-bold mr-2">
                  {qIdx + 1}
                </span>
                {q.question}
              </legend>

              <div className="space-y-2.5 mt-2" role="radiogroup" aria-label={`Question ${qIdx + 1}`}>
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = chosen === optIdx;
                  const isThisTheCorrectAnswer = submitted && optIdx === q.correctIndex;

                  let optionStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                  if (submitted) {
                    if (isThisTheCorrectAnswer) {
                      optionStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    } else if (isThisSelected && !isThisTheCorrectAnswer) {
                      optionStyle = 'border-red-500 bg-red-100 text-red-950 line-through';
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50/60 text-slate-400';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-medium ring-1 ring-indigo-600';
                  }

                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-sm transition select-none ${optionStyle}`}
                    >
                      <input
                        type="radio"
                        name={`q_${qIdx}`}
                        value={optIdx}
                        checked={isThisSelected}
                        disabled={submitted}
                        onChange={() => handleSelect(qIdx, optIdx)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 disabled:opacity-60"
                      />
                      <span className="flex-1">{opt}</span>
                      {submitted && isThisTheCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-label="Correct choice" />
                      )}
                      {submitted && isThisSelected && !isThisTheCorrectAnswer && (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-label="Incorrect choice" />
                      )}
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`mt-4 p-3 rounded-xl text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-100/70 text-amber-900 border border-amber-200'
                  }`}
                >
                  <p className="font-bold mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>{isCorrect ? 'Well done!' : 'Explanation:'}</span>
                  </p>
                  <p>{q.explanation}</p>
                </div>
              )}
            </fieldset>
          );
        })}

        {!submitted ? (
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-slate-500">
              {allAnswered
                ? 'All questions answered. Ready to submit!'
                : `${Object.keys(selectedAnswers).length} of ${questions.length} answered`}
            </p>
            <button
              type="submit"
              disabled={!allAnswered}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-sm transition focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:cursor-not-allowed"
            >
              Submit Quiz & Check Answers
            </button>
          </div>
        ) : (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleRetry}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-sm transition"
            >
              Practice Again
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
