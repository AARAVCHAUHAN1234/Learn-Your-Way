# Learn in Your Way (VSARN)
> **AI for Accessibility & Inclusive Education**  
> *One lesson, multiple accessible learning experiences.*

[![Built for Hackathon](https://img.shields.io/badge/Hackathon-Ready_MVP-indigo.svg)](#)
[![WCAG Compliant](https://img.shields.io/badge/WCAG-2.2_AA_Compliant-emerald.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](#)

---

## 🌟 Executive Summary

Educational material is traditionally shared in uniform formats (dense textbooks, static PDFs, lectures). For students with visual impairment, dyslexia, reading difficulties, or language barriers, standard formats create unnecessary obstacles.

**Learn in Your Way** solves this by letting educators upload curriculum material **once**—which the platform transforms into **six accessible, tailored modalities**:
1. **Simplified Text (Dual Reading Levels):** Foundational (early analogies) and Intermediate (structured with vocabulary).
2. **Vernacular Translation (Hindi):** Culturally & scientifically accurate translation maintaining chemical formulas and technical terminology.
3. **Assistive Text-to-Speech (Read Aloud):** Native in-browser Web Speech API player requiring zero paid API keys, with rate control.
4. **Visual & Tactile Diagram Descriptions:** Deep spatial descriptions separating observable visual features from scientific takeaways for screen readers.
5. **Interactive Practice Quizzes:** Concept-grounded multiple-choice questions with answer hiding (no client leakage), instant scoring, retry, and explanations.
6. **Teacher Oversight & Editing Studio:** Educators can review, edit, and approve all AI-generated drafts prior to student access.

---

## ⚡ Quick 60-Second Judge Demonstration Guide

No accounts, signups, or paid API keys are required to evaluate the core product.

1. **Launch App:** Open `http://localhost:3000`.
2. **Judge One-Click Demo:** Click **"Try Demo"** in the top navigation or hero section to load the **Photosynthesis** sample lesson.
3. **Explore Modalities:**
   - Click **"Simplified Text"** to toggle between *Foundational* and *Intermediate* explanations.
   - Click **"हिन्दी (Hindi)"** to verify vernacular terminology translation.
   - Click **"Listen Aloud"** to activate the assistive text-to-speech engine.
   - Click **"Visual & Diagram Description"** to inspect screen-reader spatial explanations and scientific grounding.
   - Click **"Practice Quiz"** to take the 5-question checkpoint, see instantaneous score calculations, and test the retry mechanism.
4. **Tune Learning Preferences:** Go to **Accessibility Preferences** (`/settings/accessibility`) and toggle *Hindi* or *Simplified Text* as default. Return to any lesson and observe the automatic format personalization.
5. **Teacher Studio Workflow:** Go to **Teacher Workspace** (`/teacher`) ➔ **"Process New Lesson"** (`/teacher/upload`). Select a custom PDF or click **"Load Water Cycle Sample"** to test extraction, editing, and the multi-format generation pipeline.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (App Router, Turbopack, React 19, TypeScript)
- **Styling & Accessibility:** Tailwind CSS, Lucide Icons, WCAG 2.2 AA compliant contrast, semantic HTML, visible focus indicators, screen-reader text.
- **Document Processing:** Server-side PDF extraction with `pdf-parse` and OCR fallback for scanned materials.
- **AI Transformations:** Configurable LLM provider service (`/src/lib/llmService.ts`) supporting OpenAI, Google Gemini, Anthropic, or local Ollama endpoints with deterministic content-aware fallback.
- **Speech Engine:** Native Web Speech API (`SpeechSynthesis`) with pitch, rate, and multilingual voice detection.
- **Persistence:** LocalStorage & in-memory caching adapter (`/src/lib/storageService.ts`) with zero external DB prerequisites and an architecture designed for Supabase PostgreSQL migrations.

---

## 🚀 Setup & Launch Instructions

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v24`)
- npm `v9+`

### 1. Clone & Install Dependencies
\`\`\`bash
cd learn-in-your-way
npm install
\`\`\`

### 2. Environment Variables (Optional)
The application works in demo mode out-of-the-box. To connect a live LLM:
\`\`\`bash
cp .env.example .env.local
\`\`\`
Edit `.env.local`:
\`\`\`env
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 🧪 Verification & Acceptance Criteria Status

| Requirement | Implementation State | Verification Method |
|---|---|---|
| Responsive Landing Page | ✅ Implemented | Verified on desktop, tablet, and mobile layouts |
| 60-Sec Demonstration Mode | ✅ Implemented | Tested at `/student/lessons/lesson-photosynthesis-demo` |
| Text-to-Speech Read Aloud | ✅ Implemented | Tested native browser SpeechSynthesis with rate control |
| Simplified Text (Dual Levels) | ✅ Implemented | Foundational & Intermediate levels switchable |
| Hindi Translation | ✅ Implemented | Devanagari script preserving scientific formulas |
| Visual Diagram Description | ✅ Implemented | SVG schematic + spatial layout + scientific takeaways |
| Practice Quiz with Scoring | ✅ Implemented | Interactive radio selections, retry, score tracking |
| Voluntary Learner Preferences | ✅ Implemented | Persisted preferences automatically select lesson formats |
| PDF Document Upload & OCR | ✅ Implemented | `/api/extract` server endpoint with file size validation |
| Teacher Review & Approval Studio | ✅ Implemented | Full editing workspace at `/teacher/lessons/[id]` |
| Type Checking & Production Build | ✅ Passed | `npm run build` completed with 0 errors |

---

## 🛡️ Responsible AI, Security & Ethical Boundaries

1. **Non-Diagnostic:** Learner preferences are voluntary interface choices, not medical classifications or disability labels.
2. **Educator Review:** All AI-synthesized outputs are designated as drafts until reviewed and approved by a teacher.
3. **No Answer Leakage:** Quiz evaluation and explanations are protected until user submission.
4. **Data Privacy:** Educational documents are processed on server routes without third-party retention unless explicitly configured.

---

## 👥 Team VSARN

- **Project:** Learn in Your Way
- **Track:** AI for Accessibility & Inclusive Education
- **Version:** 1.0.0 (Hackathon MVP)
