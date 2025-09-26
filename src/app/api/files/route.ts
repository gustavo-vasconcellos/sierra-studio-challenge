import { NextRequest, NextResponse } from 'next/server';
import { FileStorage } from '@/lib/file-storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    const storage = FileStorage.getInstance();

    if (fileId) {
      const file = await storage.getFile(fileId);
      if (!file) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(file);
    }

    const files = storage.getAllFiles();
    const formattedFiles = files.map(file => ({
      id: file.id,
      filename: file.filename,
      type: file.type,
      size: file.size,
      uploadedAt: file.uploadedAt
    }));

    return NextResponse.json(formattedFiles);
  } catch (error) {
    console.error('Files API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const storage = FileStorage.getInstance();
    const file = await storage.getFile(fileId);

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    await storage.deleteFile(fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}