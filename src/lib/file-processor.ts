import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { parse } from 'node-html-parser';

export interface ProcessedFile {
  id: string;
  filename: string;
  content: string;
  size: number;
  type: string;
  uploadedAt: Date;
  searchableContent: string;
}

export class FileProcessor {
  static async processFile(file: File | { name: string; size: number; type: string }, buffer: Buffer): Promise<ProcessedFile> {
    const filename = file.name;
    const type = file.type || this.getFileTypeFromExtension(filename);
    const id = this.generateId();
    const uploadedAt = new Date();

    let content = '';
    let searchableContent = '';

    try {
      switch (type) {
        case 'application/pdf':
          const pdfData = await pdfParse.default(buffer);
          content = pdfData.text;
          searchableContent = content;
          break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          const docResult = await mammoth.extractRawText({ buffer });
          content = docResult.value;
          searchableContent = content;
          break;

        case 'text/plain':
        case 'text/markdown':
        case 'application/json':
        case 'text/csv':
          content = buffer.toString('utf-8');
          searchableContent = content;
          break;

        case 'text/html':
          content = buffer.toString('utf-8');
          const root = parse(content);
          searchableContent = root.text;
          break;

        default:
          if (type.startsWith('text/')) {
            content = buffer.toString('utf-8');
            searchableContent = content;
          } else {
            throw new Error(`Unsupported file type: ${type}`);
          }
      }
    } catch (error) {
      throw new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      id,
      filename,
      content,
      size: file.size,
      type,
      uploadedAt,
      searchableContent: this.cleanSearchableContent(searchableContent)
    };
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static getFileTypeFromExtension(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
      md: 'text/markdown',
      html: 'text/html',
      htm: 'text/html',
      json: 'application/json',
      csv: 'text/csv',
      js: 'text/javascript',
      ts: 'text/typescript',
      css: 'text/css',
      xml: 'text/xml'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  private static cleanSearchableContent(content: string): string {
    return content
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:()\-]/g, '')
      .trim()
      .toLowerCase();
  }

  static getSupportedFileTypes(): string[] {
    return [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'text/html',
      'application/json',
      'text/csv',
      'text/javascript',
      'text/typescript',
      'text/css',
      'text/xml'
    ];
  }
}