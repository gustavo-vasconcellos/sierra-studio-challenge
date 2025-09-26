# Sierra Studio Challenge

This challenge is build with Next.js, that provides the best experience for uploading files and searching through their content with advanced full-text search capabilities.

## Features

- Upload PDF, Word documents, text files, and more
- Automatic text extraction from various file formats
- Real-time file processing and indexing
- Full-text search across all uploaded files
- Keyword and phrase matching
- Content highlighting in search results
- Drag & drop file upload
- File preview and metadata display
- Delete files with confirmation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **File Processing**: pdf-parse, mammoth, node-html-parser
- **Search Engine**: Custom full-text search implementation
- **Storage**: Local file system with JSON

## Supported File Types

| Format | Extensions | Description |
|--------|------------|-------------|
| PDF | `.pdf` | Portable Document Format |
| Word | `.doc`, `.docx` | Microsoft Word documents |
| Text | `.txt`, `.md` | Plain text and Markdown |
| Web | `.html`, `.css`, `.js`, `.ts` | Web development files |
| Data | `.json`, `.csv`, `.xml` | Structured data formats |

## API Endpoints

### Upload Files
```
POST /api/upload
Content-Type: multipart/form-data
Body: files (File[])
```

### Search Files
```
GET /api/search?q={query}
```

### File Management
```
GET /api/files                    # List all files
GET /api/files?id={fileId}        # Get file metadata
DELETE /api/files?id={fileId}     # Delete file
```

## Getting Started

- Node.js 18+
- npm, yarn, or any other Node package manager

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)
