import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import zlib from 'zlib';
import { PNG } from 'pngjs';
import Tesseract from 'tesseract.js';

export const dynamic = 'force-dynamic';

async function performOCR(imageBuffer: Buffer): Promise<string> {
  const workerPath = path.resolve(process.cwd(), 'node_modules/tesseract.js/src/worker-script/node/index.js');
  const worker = await Tesseract.createWorker('eng', 1, {
    workerPath,
    logger: () => {}
  });
  const res = await worker.recognize(imageBuffer);
  await worker.terminate();
  return res.data.text || '';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const filename = file.name;
    const fileType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Enforce 15MB file size limit for safety
    if (buffer.length > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed hackathon limit (15MB).' },
        { status: 400 }
      );
    }

    let extractedText = '';
    let isScanned = false;
    let extractedImageBase64: string | undefined = undefined;

    // Direct Image upload (.png, .jpg, .jpeg, .webp)
    if (fileType.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/i.test(filename)) {
      isScanned = true;
      extractedImageBase64 = `data:${fileType || 'image/png'};base64,${buffer.toString('base64')}`;
      try {
        extractedText = await performOCR(buffer);
      } catch (ocrErr) {
        console.error('Image OCR error:', ocrErr);
      }
    } else if (filename.endsWith('.txt') || fileType === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else if (filename.endsWith('.pdf') || fileType === 'application/pdf') {
      // 1. Digital text layer check
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse(new Uint8Array(buffer));
        await parser.load();
        const parsedResult = await parser.getText();
        if (parsedResult && typeof parsedResult.text === 'string') {
          const cleanDigitalText = parsedResult.text.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();
          if (cleanDigitalText.length > 25) {
            extractedText = cleanDigitalText;
          }
        }
      } catch (pdfErr) {
        console.warn('Digital text parse error:', pdfErr);
      }

      // Check for embedded images in the PDF (whether digital or scanned)
      let searchPos = 0;
      const ocrOutputs: string[] = [];

      while (searchPos < buffer.length) {
        const streamIdx = buffer.indexOf('stream', searchPos);
        if (streamIdx === -1) break;

        const dictStart = Math.max(0, streamIdx - 500);
        const dictChunk = buffer.toString('latin1', dictStart, streamIdx);

        const isImage = dictChunk.includes('/Subtype/Image') || dictChunk.includes('/Subtype /Image') || dictChunk.includes('/Image');
        const wMatch = dictChunk.match(/\/Width\s+(\d+)/);
        const hMatch = dictChunk.match(/\/Height\s+(\d+)/);
        const isGray = dictChunk.includes('DeviceGray') || dictChunk.includes('/ColorSpace/DeviceGray');

        const streamDataStart = streamIdx + (buffer[streamIdx + 6] === 0x0d && buffer[streamIdx + 7] === 0x0a ? 8 : (buffer[streamIdx + 6] === 0x0a ? 7 : 6));
        const streamEnd = buffer.indexOf('endstream', streamDataStart);
        if (streamEnd === -1) break;

        if (isImage && wMatch && hMatch) {
          const width = parseInt(wMatch[1], 10);
          const height = parseInt(hMatch[1], 10);
          const rawStream = buffer.subarray(streamDataStart, streamEnd);

          try {
            let uncompressed: Buffer;
            try {
              uncompressed = zlib.inflateSync(rawStream);
            } catch {
              uncompressed = rawStream;
            }

            const png = new PNG({ width, height });
            let src = 0;
            let dst = 0;

            if (isGray || uncompressed.length === width * height) {
              for (let p = 0; p < width * height; p++) {
                const val = uncompressed[src++];
                png.data[dst++] = val;
                png.data[dst++] = val;
                png.data[dst++] = val;
                png.data[dst++] = 255;
              }
            } else if (uncompressed.length >= width * height * 3) {
              for (let p = 0; p < width * height; p++) {
                png.data[dst++] = uncompressed[src++];
                png.data[dst++] = uncompressed[src++];
                png.data[dst++] = uncompressed[src++];
                png.data[dst++] = 255;
              }
            }

            const pngBuf = PNG.sync.write(png);

            // Save the first major image found as the document's visual artifact!
            if (!extractedImageBase64 && width > 100 && height > 100) {
              extractedImageBase64 = `data:image/png;base64,${pngBuf.toString('base64')}`;
            }

            // If digital text was empty, run OCR on the image
            if (!extractedText || extractedText.trim().length < 20) {
              isScanned = true;
              const textResult = await performOCR(pngBuf);
              if (textResult && textResult.trim().length > 10) {
                ocrOutputs.push(textResult.trim());
              }
            }
          } catch (imgOcrErr) {
            console.warn('Stream OCR error:', imgOcrErr);
          }
        }

        searchPos = streamEnd + 9;
      }

      if ((!extractedText || extractedText.trim().length < 20) && ocrOutputs.length > 0) {
        extractedText = ocrOutputs.join('\n\n');
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a PDF (.pdf), image (.png, .jpg), or text (.txt) document.' },
        { status: 400 }
      );
    }

    // Clean up extracted OCR text formatting
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/[«]/g, '•')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanedText && !extractedImageBase64) {
      return NextResponse.json({
        success: false,
        error: 'No text or recognizable image content could be extracted from this document.'
      }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      filename,
      isScanned,
      extractedText: cleanedText,
      hasImage: Boolean(extractedImageBase64),
      imageBase64: extractedImageBase64,
      characterCount: cleanedText.length,
      wordCount: cleanedText.split(/\s+/).filter(Boolean).length
    });
  } catch (error: unknown) {
    console.error('File extraction error:', error);
    const message = error instanceof Error ? error.message : 'Error extracting text from file.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
