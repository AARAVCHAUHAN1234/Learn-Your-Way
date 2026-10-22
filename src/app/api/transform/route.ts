import { NextRequest, NextResponse } from 'next/server';
import { generateTransformations, isLLMConfigured } from '@/lib/llmService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Lesson text is required for transformation.' },
        { status: 400 }
      );
    }

    const lessonTitle = title && typeof title === 'string' ? title : 'Educational Lesson';
    const result = await generateTransformations(text, lessonTitle);

    return NextResponse.json({
      success: true,
      provider: result.provider,
      modelUsed: result.modelUsed,
      llmConfigured: isLLMConfigured(),
      data: result.data
    });
  } catch (error: unknown) {
    console.error('API transform error:', error);
    const message = error instanceof Error ? error.message : 'Transformation pipeline error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
