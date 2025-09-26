import { NextRequest, NextResponse } from 'next/server';
import { FileStorage } from '@/lib/file-storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const storage = FileStorage.getInstance();
    const results = storage.search(query.trim());

    const formattedResults = results.map(result => ({
      file: {
        id: result.file.id,
        filename: result.file.filename,
        type: result.file.type,
        size: result.file.size,
        uploadedAt: result.file.uploadedAt
      },
      matches: result.matches.map(match => ({
        snippet: match.snippet,
        highlight: match.highlight
      }))
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
