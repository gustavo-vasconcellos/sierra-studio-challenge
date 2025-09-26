import { NextRequest, NextResponse } from 'next/server';
import { FileProcessor } from '@/lib/file-processor';
import { FileStorage } from '@/lib/file-storage';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const storage = FileStorage.getInstance();
    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        if (file.size === 0) {
          errors.push({ filename: file.name, error: 'Empty file' });
          continue;
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const processedFile = await FileProcessor.processFile(file, buffer);
        await storage.storeFile(processedFile, buffer);

        results.push({
          id: processedFile.id,
          filename: processedFile.filename,
          type: processedFile.type,
          size: processedFile.size,
          uploadedAt: processedFile.uploadedAt
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ filename: file.name, error: errorMessage });
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}