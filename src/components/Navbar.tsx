'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Sparkles, GraduationCap, Settings, ShieldCheck, HeartHandshake } from 'lucide-react';

export function NavigationHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/student', label: 'Student Workspace', icon: GraduationCap },
    { href: '/teacher', label: 'Teacher Workspace', icon: BookOpen },
    { href: '/settings/accessibility', label: 'Accessibility Preferences', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Learn in Your Way</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">VSARN</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">AI for Accessibility & Inclusive Education</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              href="/student/lessons/lesson-photosynthesis-demo"
              className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <span>Try Demo</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">Learn in Your Way</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Team VSARN — Built for inclusive education. One source lesson seamlessly transformed into audio narration, visual diagrams, simplified reading levels, multilingual translations, and interactive quizzes.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition">Home Overview</Link></li>
              <li><Link href="/student" className="hover:text-white transition">Student Learning Experience</Link></li>
              <li><Link href="/teacher" className="hover:text-white transition">Teacher Lesson Studio</Link></li>
              <li><Link href="/teacher/upload" className="hover:text-white transition">Upload Educational PDF</Link></li>
              <li><Link href="/settings/accessibility" className="hover:text-white transition">Personalize Accessibility Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ethical AI & Compliance</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Adheres to WCAG 2.2 AA accessibility guidelines. Voluntary learner preference matching — not medical classification or diagnosis. Teacher oversight is built into every generated format.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-indigo-300">
              <HeartHandshake className="w-4 h-4" />
              <span>Empowering educators and diverse learners.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 Team VSARN (Learn in Your Way). All rights reserved.</p>
          <p className="mt-2 sm:mt-0">WCAG 2.2 AA Compliant | Privacy-First & Offline Fallback Enabled</p>
        </div>
      </div>
    </footer>
  );
}
