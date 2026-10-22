'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

interface TTSPlayerProps {
  textToRead: string;
  lang?: string;
  title?: string;
}

export function TTSPlayer({ textToRead, lang = 'en', title = 'Lesson Content' }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [supported, setSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop playback if text changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [textToRead]);

  const handlePlay = () => {
    if (!supported || !textToRead) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text: strip markdown characters for natural speech
    const cleanSpeechText = textToRead
      .replace(/[*#_`>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Pick appropriate voice for language
    if (availableVoices.length > 0) {
      const matchingVoice = availableVoices.find(v => 
        lang === 'hi' ? v.lang.startsWith('hi') : v.lang.startsWith(lang)
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!supported) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    if (isPlaying && utteranceRef.current) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  if (!supported) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
        <VolumeX className="w-5 h-5 text-amber-600 shrink-0" />
        <span>Browser speech synthesis is not supported on this device. Audio transcript text remains accessible below.</span>
      </div>
    );
  }

  return (
    <section 
      aria-label="Text to speech audio controls"
      className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Read Aloud: {title}</h4>
          <p className="text-xs text-slate-600">
            {isPlaying ? 'Currently reading aloud...' : isPaused ? 'Paused' : 'Native in-browser assistive narration'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            aria-label="Play lesson audio"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPaused ? 'Resume' : 'Play Narration'}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition focus:ring-2 focus:ring-amber-600 focus:outline-none"
            aria-label="Pause audio"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Stop audio"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs">
          <span className="text-slate-500 font-medium">Speed:</span>
          {[0.8, 1.0, 1.25].map(rate => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition ${
                speechRate === rate ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
