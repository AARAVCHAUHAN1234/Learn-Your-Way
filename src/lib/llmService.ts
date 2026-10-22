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
    scientificInterpretation: z.string()
  }),
  quiz: z.array(QuizQuestionSchema).min(3)
});

export type TransformationResponse = z.infer<typeof TransformationResponseSchema>;

export interface LLMConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export function getLLMConfig(): LLMConfig {
  return {
    apiKey: process.env.LLM_API_KEY || '',
    baseUrl: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.LLM_MODEL || 'gpt-4o-mini'
  };
}

export function isLLMConfigured(): boolean {
  return Boolean(process.env.LLM_API_KEY && process.env.LLM_API_KEY.trim().length > 0);
}

/**
 * Generate intelligent transformations using configured LLM or provide high-quality fallback
 */
export async function generateTransformations(lessonText: string, lessonTitle: string): Promise<{
  data: TransformationResponse;
  provider: 'llm' | 'deterministic-fallback';
  modelUsed?: string;
}> {
  const config = getLLMConfig();

  if (!config.apiKey) {
    // Return high-quality rule-based/content-aware fallback for hackathon demonstration
    return {
      provider: 'deterministic-fallback',
      data: generateContentAwareFallback(lessonText, lessonTitle)
    };
  }

  // Live LLM Provider Integration
  const systemPrompt = `You are an expert accessibility and inclusive education specialist. Given educational lesson text, produce high quality transformations formatted strictly as JSON adhering to this schema:
{
  "simplifiedFoundational": "Simple, encouraging explanation for early readers or learners with reading difficulties using analogies and short sentences.",
  "simplifiedIntermediate": "Clear, structured version preserving scientific/technical vocabulary with intuitive explanations.",
  "hindiTranslation": "Accurate, natural Hindi translation preserving scientific terms in transliteration/parentheses.",
  "diagramDescription": {
    "title": "Title of the primary conceptual diagram representing this topic",
    "altText": "Concise screen-reader alt text (under 120 chars)",
    "detailedDescription": "Comprehensive spatial description for visually impaired learners detailing layout, parts, flow, and text labels.",
    "keyVisualElements": ["Element 1", "Element 2", "Element 3"],
    "scientificInterpretation": "Educational meaning and key takeaway of the diagram."
  },
  "quiz": [
    {
      "id": "q1",
      "question": "Question based on content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is scientifically correct."
    }
  ]
}
Return only raw JSON. Generate at least 5 quiz questions.`;

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Title: ${lessonTitle}\n\nContent:\n${lessonText.slice(0, 4000)}` }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('LLM API returned error, falling back to deterministic processing:', errText);
      return {
        provider: 'deterministic-fallback',
        data: generateContentAwareFallback(lessonText, lessonTitle)
      };
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    const validated = TransformationResponseSchema.parse(parsed);

    return {
      provider: 'llm',
      modelUsed: config.model,
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

function generateContentAwareFallback(text: string, title: string): TransformationResponse {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);

  const keySentence1 = sentences[0] || `${title} is an important educational concept.`;
  const keySentence2 = sentences[1] || `It explains how different components interact in the natural world.`;
  const keySentence3 = sentences[2] || `Understanding this topic helps us make sense of everyday phenomena.`;

  return {
    simplifiedFoundational: `Let's explore ${title} together!\n\nHere are the big ideas in simple words:\n1. What it is: ${keySentence1.replace(/enzymatic|cascade|photoautotrophs|biochemical/gi, 'natural process')}\n2. How it works: ${keySentence2}\n3. Why it matters: It keeps our world functioning and gives us important materials and energy!`,
    simplifiedIntermediate: `${title} - Core Summary:\n\n${keySentence1}\n\nKey Concepts:\n- Mechanism: ${keySentence2}\n- Importance: ${keySentence3}\n\nThis principle forms the cornerstone of scientific understanding in this domain.`,
    hindiTranslation: `${title} का परिचय:\n\nयह पाठ मुख्य रूप से बताता है कि "${keySentence1}"\n\nमहत्वपूर्ण बिंदु:\n- यह प्रक्रिया प्राकृतिक संतुलन बनाए रखने में अत्यधिक सहायक है।\n- वैज्ञानिक रूप से यह ऊर्जा और पदार्थों के रूपांतरण का एक मुख्य उदाहरण है।`,
    diagramDescription: {
      title: `Conceptual Overview Diagram: ${title}`,
      altText: `Flowchart showing the essential inputs, central transformation mechanism, and resulting outputs of ${title}.`,
      detailedDescription: `A clear educational schematic diagram illustrating the primary flow of ${title}.
Left side: Primary foundational components and inputs entering the system.
Center: The core transformation chamber where chemical or physical reactions occur.
Right side: Final products and positive environmental impacts generated by the process.`,
      keyVisualElements: [
        `System Inputs and environmental variables for ${title}`,
        'Core interaction / processing node',
        'Resulting outputs and biological/scientific benefits'
      ],
      scientificInterpretation: `The diagram demonstrates the conservation of energy and materials through the systematic steps of ${title}.`
    },
    quiz: [
      {
        id: 'q1',
        question: `What is the primary topic explored in this lesson?`,
        options: [title, 'Nuclear fission', 'Classical architecture', 'Economic inflation'],
        correctIndex: 0,
        explanation: `The lesson explicitly focuses on explaining the core principles and outcomes of ${title}.`
      },
      {
        id: 'q2',
        question: `Based on the lesson, why is understanding ${title} significant?`,
        options: [
          'It has no real-world application',
          'It explains crucial interactions and energy transfers in science',
          'It was completely disproven centuries ago',
          'It only occurs inside sealed vacuum chambers'
        ],
        correctIndex: 1,
        explanation: `The text outlines how the process directly supports natural biological, chemical, or physical phenomena.`
      },
      {
        id: 'q3',
        question: `What happens to the inputs in the described system?`,
        options: [
          'They are destroyed completely without a trace',
          'They are transformed systematically into useful outputs',
          'They remain frozen indefinitely',
          'They turn into gold atoms'
        ],
        correctIndex: 1,
        explanation: 'Scientific systems convert incoming raw materials or energy into specific products through balanced mechanisms.'
      },
      {
        id: 'q4',
        question: `Which of the following best describes the learning approach used in this topic?`,
        options: [
          'Observation and scientific evidence',
          'Unsubstantiated speculation',
          'Ignoring all measurements',
          'Skipping foundational concepts'
        ],
        correctIndex: 0,
        explanation: 'Educational science lessons rely on observable steps, experimental evidence, and balanced chemical or conceptual relationships.'
      },
      {
        id: 'q5',
        question: `How does the process described contribute to the wider environment?`,
        options: [
          'By maintaining ecological and systemic stability',
          'By causing random chaos',
          'By eliminating all sunlight on earth',
          'By stopping the flow of water'
        ],
        correctIndex: 0,
        explanation: 'Natural cycles and physical laws operate in concert to uphold systemic balance and support life.'
      }
    ]
  };
}
