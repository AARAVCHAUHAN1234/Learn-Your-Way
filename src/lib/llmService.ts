import { z } from 'zod';

export const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(5),
  options: z.array(z.string()).min(2).max(5),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(5)
});

export const TransformationResponseSchema = z.object({
  simplifiedFoundational: z.string(),
  simplifiedIntermediate: z.string(),
  hindiTranslation: z.string(),
  diagramDescription: z.object({
    title: z.string(),
    altText: z.string(),
    detailedDescription: z.string(),
    keyVisualElements: z.array(z.string()),
    scientificInterpretation: z.string(),
    svgDiagram: z.string().optional()
  }),
  quiz: z.array(QuizQuestionSchema).min(3)
});

export type TransformationResponse = z.infer<typeof TransformationResponseSchema>;

export interface LLMConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  provider?: 'gemini' | 'groq' | 'openai';
}

export function getLLMConfig(): LLMConfig {
  // Support GEMINI_API_KEY, GROQ_API_KEY, or generic LLM_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const groqKey = process.env.GROQ_API_KEY || '';
  const genericKey = process.env.LLM_API_KEY || '';

  if (geminiKey) {
    return {
      apiKey: geminiKey,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      provider: 'gemini'
    };
  }

  if (groqKey) {
    return {
      apiKey: groqKey,
      baseUrl: 'https://api.groq.com/openai/v1',
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      provider: 'groq'
    };
  }

  return {
    apiKey: genericKey,
    baseUrl: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
    provider: 'openai'
  };
}

export function isLLMConfigured(): boolean {
  const cfg = getLLMConfig();
  return Boolean(cfg.apiKey && cfg.apiKey.trim().length > 0);
}

/**
 * Generate intelligent transformations using configured LLM or provide high-quality fallback.
 * Optionally accepts imageBase64 (a data URL) to enable multi-modal image insight.
 */
export async function generateTransformations(
  lessonText: string,
  lessonTitle: string,
  imageBase64?: string
): Promise<{
  data: TransformationResponse;
  provider: 'llm' | 'deterministic-fallback';
  modelUsed?: string;
}> {
  const config = getLLMConfig();

  if (!config.apiKey) {
    return {
      provider: 'deterministic-fallback',
      data: generateContentAwareFallback(lessonText, lessonTitle)
    };
  }

  const systemPrompt = `You are an expert accessibility, inclusive education, and STEM diagram designer.
Given educational lesson text${imageBase64 ? ' and an accompanying image' : ''}, produce high quality transformations formatted STRICTLY as a JSON object adhering to this schema:
{
  "simplifiedFoundational": "Simple, encouraging explanation for early readers or learners with reading difficulties using everyday analogies and short sentences.",
  "simplifiedIntermediate": "Clear, structured version preserving scientific/technical vocabulary with intuitive explanations.",
  "hindiTranslation": "Accurate, natural Hindi translation written in fluent Devanagari script preserving scientific terms in transliteration/parentheses.",
  "diagramDescription": {
    "title": "Clear Title of the visual diagram representing this specific topic",
    "altText": "Concise screen-reader alt text (under 120 chars)",
    "detailedDescription": "Comprehensive spatial description for visually impaired learners detailing layout, parts, flow, inputs, reaction chamber, and output labels.",
    "keyVisualElements": ["Element 1 (e.g. Input/Component)", "Element 2 (Process/Core)", "Element 3 (Output/Result)"],
    "scientificInterpretation": "Educational meaning and key takeaway of the diagram.${imageBase64 ? ' Also include a concise visual insight describing what you observe in the provided image.' : ''}",
    "svgDiagram": "A complete, self-contained SVG element code string (with viewBox='0 0 600 240', width and height styled, clean rounded rectangles, labels, and arrows visually representing this specific topic's stages, inputs, and outputs! Do NOT use HTML tags inside SVG, use <text> and <rect> and <path>)"
  },
  "quiz": [
    {
      "id": "q1",
      "question": "Specific question testing a core concept directly mentioned in this lesson text",
      "options": ["Accurate Option", "Plausible Distractor 1", "Plausible Distractor 2", "Plausible Distractor 3"],
      "correctIndex": 0,
      "explanation": "Clear explanation of why this answer is scientifically correct based on the text."
    }
  ]
}

Important Rules:
1. Generate AT LEAST 5 unique, deeply relevant quiz questions testing actual specific facts from the lesson.
2. In 'diagramDescription.svgDiagram', generate custom clean SVG vector illustration tailored directly to this lesson's concept.
3. Return ONLY valid, parseable JSON without any Markdown code blocks around it if possible, or inside \`\`\`json.`;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Lesson Title: ${lessonTitle}\n\nContent:\n${lessonText.slice(0, 4000)}` }
    ];

    // If image is provided, add a multi-modal user message with the image
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: 'An image/diagram from the lesson document is attached. Please incorporate a concise visual insight about this image into diagramDescription.scientificInterpretation.' },
          { type: 'image_url', image_url: { url: imageBase64 } }
        ]
      });
    }

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('LLM API returned error, falling back to content-aware generator:', errText);
      return {
        provider: 'deterministic-fallback',
        data: generateContentAwareFallback(lessonText, lessonTitle)
      };
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    const cleanJson = content.replace(/^```json/g, '').replace(/```$/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    const validated = TransformationResponseSchema.parse(parsed);

    return {
      provider: 'llm',
      modelUsed: `${config.provider?.toUpperCase()} (${config.model})`,
      data: validated
    };
  } catch (error) {
    console.error('Failed to call LLM provider:', error);
    return {
      provider: 'deterministic-fallback',
      data: generateContentAwareFallback(lessonText, lessonTitle)
    };
  }
}

/**
 * Generate image insight separately if needed (e.g. for on-demand "Regenerate Insight" button).
 */
export async function generateImageInsight(imageBase64: string, lessonTitle: string): Promise<string> {
  const config = getLLMConfig();
  if (!config.apiKey) return '';
  const prompt = `Provide a concise, accessible description (under 150 words) of the educational diagram or image related to the lesson titled "${lessonTitle}". Focus on concrete visual elements and their educational relevance. No speculation.`;
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }],
        temperature: 0.5,
        max_tokens: 300
      })
    });
    if (!response.ok) return '';
    const data = await response.json();
    const txt = data.choices?.[0]?.message?.content?.trim();
    return txt || '';
  } catch {
    return '';
  }
}

/**
 * Intelligent content-aware fallback when no API key is set
 */
function generateContentAwareFallback(text: string, title: string): TransformationResponse {
  const cleanTitle = title.trim();
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  const keySentence1 = sentences[0] || `${cleanTitle} is a key concept in science and nature.`;
  const keySentence2 = sentences[1] || `It explains how elements and energy interact in a continuous cycle.`;
  const keySentence3 = sentences[2] || `Understanding this mechanism helps explain fundamental environmental processes.`;

  // Detect key terms from the text
  const words = text
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !['about', 'which', 'their', 'there', 'these', 'where', 'through', 'called', 'plants', 'because'].includes(w.toLowerCase()));

  const uniqueKeywords = Array.from(new Set(words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))).slice(0, 8);

  const term1 = uniqueKeywords[0] || 'Primary Input';
  const term2 = uniqueKeywords[1] || 'Transformation Process';
  const term3 = uniqueKeywords[2] || 'Output Energy';
  const term4 = uniqueKeywords[3] || 'System Cycle';

  // Dynamic SVG tailored to the lesson title and terms
  const generatedSvg = `
<svg viewBox="0 0 600 240" className="w-full h-auto" role="img">
  <defs>
    <linearGradient id="gradFlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.1" />
      <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
    </linearGradient>
  </defs>

  <!-- Background container -->
  <rect x="10" y="10" width="580" height="220" rx="16" fill="url(#gradFlow)" stroke="#CBD5E1" strokeWidth="1.5" />

  <!-- Stage 1: Input -->
  <g transform="translate(30, 50)">
    <rect x="0" y="0" width="140" height="90" rx="12" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2" />
    <text x="70" y="28" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3730A3">STAGE 1: INPUT</text>
    <text x="70" y="52" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1E1B4B">${escapeXml(term1)}</text>
    <text x="70" y="70" textAnchor="middle" fontSize="10" fill="#6B7280">Environmental Influx</text>
    <!-- Arrow -->
    <path d="M145 45 L185 45" stroke="#6366F1" strokeWidth="2.5" markerEnd="url(#arrow)" />
  </g>

  <!-- Stage 2: Central Transformation -->
  <g transform="translate(225, 40)">
    <rect x="0" y="0" width="160" height="110" rx="14" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />
    <text x="80" y="28" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065F46">CORE MECHANISM</text>
    <text x="80" y="54" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#047857">${escapeXml(cleanTitle.slice(0, 18))}</text>
    <text x="80" y="74" textAnchor="middle" fontSize="11" fontWeight="600" fill="#065F46">${escapeXml(term2)}</text>
    <text x="80" y="92" textAnchor="middle" fontSize="10" fill="#059669">Dynamic Transformation</text>
    <!-- Arrow -->
    <path d="M165 55 L205 55" stroke="#10B981" strokeWidth="2.5" />
  </g>

  <!-- Stage 3: Product / Output -->
  <g transform="translate(435, 50)">
    <rect x="0" y="0" width="140" height="90" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
    <text x="70" y="28" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400E">STAGE 3: OUTPUT</text>
    <text x="70" y="52" textAnchor="middle" fontSize="12" fontWeight="600" fill="#78350F">${escapeXml(term3)}</text>
    <text x="70" y="70" textAnchor="middle" fontSize="10" fill="#B45309">Sustained Balance</text>
  </g>

  <!-- Bottom Return Cycle Flow -->
  <path d="M500 145 C 500 190, 100 190, 100 145" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 4" />
  <text x="300" y="195" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#64748B">◄ Continuous System Loop: ${escapeXml(term4)} ◄</text>
</svg>`.trim();

  return {
    simplifiedFoundational: `Let's explore ${cleanTitle} together!\n\nHere are the big ideas in simple words:\n1. What it is: ${keySentence1}\n2. How it works: ${keySentence2}\n3. Why it matters: It maintains natural harmony, providing energy and crucial materials for life!`,
    simplifiedIntermediate: `${cleanTitle} - Core Summary:\n\n${keySentence1}\n\nKey Concepts:\n- Mechanism: ${keySentence2}\n- Impact: ${keySentence3}\n\nThis principle forms the cornerstone of scientific understanding in this domain.`,
    hindiTranslation: `${cleanTitle} का सुगम परिचय:\n\nयह पाठ मुख्य रूप से व्याख्या करता है कि: "${keySentence1}"\n\nमुख्य अवधारणाएं:\n1. प्रक्रिया: ${keySentence2}\n2. पर्यावरण और जीवन में महत्व: यह प्रक्रिया प्राकृतिक संतुलन और ऊर्जा चक्र को बनाए रखने में अनिवार्य भूमिका निभाती है।`,
    diagramDescription: {
      title: `${cleanTitle} - System Flow & Cycle Diagram`,
      altText: `Vector diagram illustrating the three progressive phases of ${cleanTitle}: ${term1}, ${term2}, and ${term3}.`,
      detailedDescription: `A comprehensive three-stage schematic representing ${cleanTitle}:
1. Left Section (Input Phase): Depicts the primary inflow of ${term1} entering the biological or environmental boundary.
2. Center Section (Transformation Chamber): Highlights the core mechanism of ${cleanTitle} where ${term2} catalyzes the transition.
3. Right Section (Output Phase): Illustrates the generation of ${term3} and its distribution into the ecosystem.
4. Base Loop: A continuous feedback loop showing how ${term4} maintains systemic equilibrium.`,
      keyVisualElements: [
        `Stage 1: ${term1} (Initial Inflow & Variables)`,
        `Stage 2: ${term2} (Transformation Engine for ${cleanTitle})`,
        `Stage 3: ${term3} (Resulting Products & Energy Release)`,
        `Cycle Continuity: ${term4} (Feedback & Natural Equilibrium)`
      ],
      scientificInterpretation: `The diagram demonstrates the conservation of matter and energy during ${cleanTitle}. No materials are lost; inputs are systematically reorganized into sustainable outputs.`,
      svgDiagram: generatedSvg
    },
    quiz: [
      {
        id: 'q1',
        question: `What is the central focus and theme of this lesson on ${cleanTitle}?`,
        options: [
          `Understanding the mechanism and importance of ${cleanTitle}`,
          'Calculating gravitational pull on Jupiter',
          'Analyzing 18th-century European trade routes',
          'Measuring the speed of sound through solid steel'
        ],
        correctIndex: 0,
        explanation: `The lesson is specifically focused on describing the principles, stages, and significance of ${cleanTitle}.`
      },
      {
        id: 'q2',
        question: `According to the lesson, what primary role does "${term1}" play in ${cleanTitle}?`,
        options: [
          'It is completely ignored by the system',
          `It serves as an essential component or input for ${cleanTitle}`,
          'It acts as an artificial poison that halts all activity',
          'It only exists in outer space'
        ],
        correctIndex: 1,
        explanation: `In the lesson, ${term1} is identified as a critical factor initiating or taking part in ${cleanTitle}.`
      },
      {
        id: 'q3',
        question: `Which statement accurately describes how "${term2}" relates to this lesson?`,
        options: [
          `It represents a key stage or transformation characteristic of ${cleanTitle}`,
          'It has no scientific connection to the subject',
          'It proves that matter is destroyed permanently',
          'It was invented as a mythical concept'
        ],
        correctIndex: 0,
        explanation: `The educational text details ${term2} as an integral element of the observed process.`
      },
      {
        id: 'q4',
        question: `What is the major outcome or environmental impact associated with "${term3}"?`,
        options: [
          'It creates an immediate catastrophic collapse',
          `It delivers useful products and sustains the balance of ${cleanTitle}`,
          'It freezes the planet to absolute zero',
          'It turns all water into carbon dioxide'
        ],
        correctIndex: 1,
        explanation: `${term3} represents the functional products and ecological benefits resulting from the system.`
      },
      {
        id: 'q5',
        question: `Why is the continuous cycle of "${term4}" vital for natural ecosystems?`,
        options: [
          'It redistributes essential resources and maintains long-term sustainability',
          'It stops all plants and animals from growing',
          'It prevents daylight from reaching the Earth',
          'It eliminates all atmospheric gases'
        ],
        correctIndex: 0,
        explanation: `Natural cycles continuously replenish resources, ensuring ongoing equilibrium and biological sustainability.`
      }
    ]
  };
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
