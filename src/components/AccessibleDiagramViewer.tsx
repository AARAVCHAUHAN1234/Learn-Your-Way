import React from 'react';
import { Sparkles, Eye, Info, ImageIcon } from 'lucide-react';

interface DiagramCardProps {
  title: string;
  altText: string;
  detailedDescription: string;
  keyVisualElements: string[];
  scientificInterpretation: string;
  imageUrl?: string;
  svgDiagram?: string;
}

export function AccessibleDiagramViewer({
  title,
  altText,
  detailedDescription,
  keyVisualElements,
  scientificInterpretation,
  imageUrl,
  svgDiagram,
}: DiagramCardProps) {
  // If an exact uploaded image is available, render the exact image!
  const hasExactImage = Boolean(imageUrl && imageUrl.trim().length > 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Visual illustration banner */}
      <div className="p-6 bg-gradient-to-b from-sky-50 via-emerald-50/50 to-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              {hasExactImage ? <ImageIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              {hasExactImage ? 'Exact Extracted Document Figure' : 'Tactile & Visual Description'}
            </span>
          </div>
          <span className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-full font-medium">
            Screen-Reader Optimized
          </span>
        </div>

        {/* Display Exact Uploaded Image or Dynamic Vector Diagram */}
        <div className="w-full max-w-2xl mx-auto my-4 bg-white p-4 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center">
          {hasExactImage ? (
            <div className="flex flex-col items-center">
              <img
                src={imageUrl}
                alt={altText}
                className="max-h-[360px] w-auto max-w-full object-contain rounded-lg shadow-sm"
              />
              <span className="mt-2 text-[10px] text-slate-400 font-mono">
                Source Document Image (Extracted & Grounded)
              </span>
            </div>
          ) : svgDiagram ? (
            <div
              className="w-full h-auto overflow-hidden"
              dangerouslySetInnerHTML={{ __html: svgDiagram }}
            />
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No visual figures available for this text note.
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 font-medium">
          Figure: {title}
        </p>
      </div>

      {/* Grounded Visual Insights & Structured Text for Accessibility */}
      <div className="p-6 space-y-5">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Visual Insights & Spatial Description</span>
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {detailedDescription}
          </p>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Key Visual Elements & Grounded Features
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
            <span>Educational Takeaway & Concept Interpretation</span>
          </h5>
          <p className="text-xs text-slate-600 leading-relaxed">
            {scientificInterpretation}
          </p>
        </div>
      </div>
    </div>
  );
}
