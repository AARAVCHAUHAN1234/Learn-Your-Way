import React from 'react';
import { Sparkles, Eye, Info } from 'lucide-react';

interface DiagramCardProps {
  title: string;
  altText: string;
  detailedDescription: string;
  keyVisualElements: string[];
  scientificInterpretation: string;
}

export function AccessibleDiagramViewer({
  title,
  altText,
  detailedDescription,
  keyVisualElements,
  scientificInterpretation,
}: DiagramCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Visual illustration banner with SVG vectors */}
      <div className="p-6 bg-gradient-to-b from-sky-50 via-emerald-50/50 to-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Tactile & Visual Description
            </span>
          </div>
          <span className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-full font-medium">
            Screen-Reader Optimized
          </span>
        </div>

        {/* Clean semantic SVG diagram for Photosynthesis / Scientific cycles */}
        <div className="w-full max-w-2xl mx-auto my-4 bg-white p-6 rounded-xl border border-slate-200 shadow-inner">
          <svg
            viewBox="0 0 600 240"
            className="w-full h-auto"
            role="img"
            aria-label={altText}
          >
            {/* Sun / Solar Radiation */}
            <g transform="translate(50, 40)">
              <circle cx="30" cy="30" r="22" fill="#FBBF24" />
              <circle cx="30" cy="30" r="26" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
              <text x="30" y="70" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#B45309">
                Sunlight (Energy)
              </text>
              <path d="M50 45 L110 80" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow)" strokeDasharray="3 3" />
            </g>

            {/* Central Leaf Reactor */}
            <g transform="translate(180, 50)">
              <rect x="0" y="0" width="240" height="130" rx="20" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />
              <text x="120" y="32" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#065F46">
                Plant Leaf (Chloroplasts)
              </text>
              <text x="120" y="52" textAnchor="middle" fontSize="11" fill="#047857">
                Chlorophyll Absorbs Solar Photons
              </text>
              
              {/* Formula */}
              <rect x="20" y="70" width="200" height="42" rx="8" fill="#FFFFFF" stroke="#A7F3D0" />
              <text x="120" y="96" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#064E3B">
                6CO2 + 6H2O ➔ C6H12O6 + 6O2
              </text>
            </g>

            {/* Inputs: Carbon Dioxide and Water */}
            <g transform="translate(40, 140)">
              <rect x="0" y="0" width="105" height="46" rx="10" fill="#F1F5F9" stroke="#94A3B8" />
              <text x="52" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
                Carbon Dioxide
              </text>
              <text x="52" y="36" textAnchor="middle" fontSize="9" fill="#64748B">
                CO2 from air
              </text>
              <path d="M105 23 L175 65" stroke="#64748B" strokeWidth="2" strokeDasharray="4 2" />
            </g>

            <g transform="translate(180, 200)">
              <text x="120" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0284C7">
                ▲ Water (H2O) absorbed via roots
              </text>
            </g>

            {/* Outputs: Oxygen & Glucose */}
            <g transform="translate(450, 45)">
              <rect x="0" y="0" width="120" height="50" rx="10" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
              <text x="60" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E40AF">
                Oxygen (O2)
              </text>
              <text x="60" y="38" textAnchor="middle" fontSize="9" fill="#2563EB">
                Released into air
              </text>
              <path d="M-25 25 L-2 25" stroke="#3B82F6" strokeWidth="2" />
            </g>

            <g transform="translate(450, 115)">
              <rect x="0" y="0" width="120" height="50" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
              <text x="60" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400E">
                Glucose (Sugar)
              </text>
              <text x="60" y="38" textAnchor="middle" fontSize="9" fill="#B45309">
                Stored plant energy
              </text>
              <path d="M-25 25 L-2 25" stroke="#F59E0B" strokeWidth="2" />
            </g>
          </svg>
        </div>

        <p className="text-center text-xs text-slate-500 font-medium">
          Diagram: {title}
        </p>
      </div>

      {/* Structured Text for Screen Readers & In-depth Understanding */}
      <div className="p-6 space-y-5">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Screen-Reader & Spatial Description</span>
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {detailedDescription}
          </p>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Key Visual Elements & Labels
          </h5>
          <ul className="space-y-1.5">
            {keyVisualElements.map((el, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{el}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-sky-600" />
            <span>Scientific Concept Grounding</span>
          </h5>
          <p className="text-xs text-slate-600 leading-relaxed">
            {scientificInterpretation}
          </p>
        </div>
      </div>
    </div>
  );
}
