import { ProcessedFile } from './file-processor';

export interface SearchResult {
  file: ProcessedFile;
  matches: SearchMatch[];
}

export interface SearchMatch {
  snippet: string;
  startIndex: number;
  endIndex: number;
  highlight: string;
}

export class SearchEngine {
  private files: ProcessedFile[] = [];
  private index: Map<string, Set<string>> = new Map();

  addFile(file: ProcessedFile): void {
    this.files.push(file);
    this.indexFile(file);
  }

  removeFile(fileId: string): void {
    const fileIndex = this.files.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      const file = this.files[fileIndex];
      this.removeFromIndex(file);
      this.files.splice(fileIndex, 1);
    }
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    const queryTerms = this.tokenize(normalizedQuery);

    const results: SearchResult[] = [];

    for (const file of this.files) {
      const matches = this.findMatches(file, normalizedQuery, queryTerms);
      if (matches.length > 0) {
        results.push({
          file,
          matches
        });
      }
    }

    return results
  }

  getAllFiles(): ProcessedFile[] {
    return [...this.files];
  }

  private indexFile(file: ProcessedFile): void {
    const tokens = this.tokenize(file.searchableContent);
    for (const token of tokens) {
      if (!this.index.has(token)) {
        this.index.set(token, new Set());
      }
      this.index.get(token)!.add(file.id);
    }
  }

  private removeFromIndex(file: ProcessedFile): void {
    const tokens = this.tokenize(file.searchableContent);
    for (const token of tokens) {
      const fileIds = this.index.get(token);
      if (fileIds) {
        fileIds.delete(file.id);
        if (fileIds.size === 0) {
          this.index.delete(token);
        }
      }
    }
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  private findMatches(file: ProcessedFile, query: string, queryTerms: string[]): SearchMatch[] {
    const matches: SearchMatch[] = [];
    const content = file.content.toLowerCase();
    const originalContent = file.content;

    for (const term of queryTerms) {
      let startIndex = 0;
      while (true) {
        const index = content.indexOf(term, startIndex);
        if (index === -1) break;

        const snippetStart = Math.max(0, index - 50);
        const snippetEnd = Math.min(content.length, index + term.length + 50);
        const snippet = originalContent.substring(snippetStart, snippetEnd);

        const highlightStart = index - snippetStart;
        const highlightEnd = highlightStart + term.length;
        const beforeHighlight = snippet.substring(0, highlightStart);
        const highlighted = snippet.substring(highlightStart, highlightEnd);
        const afterHighlight = snippet.substring(highlightEnd);

        matches.push({
          snippet: snippet.trim(),
          startIndex: index,
          endIndex: index + term.length,
          highlight: beforeHighlight + '<mark>' + highlighted + '</mark>' + afterHighlight
        });

        startIndex = index + 1;
        if (matches.length >= 10) break;
      }
    }

    const exactMatches = this.findExactMatches(file, query);
    matches.push(...exactMatches);

    return matches
      .sort((a, b) => a.startIndex - b.startIndex)
      .slice(0, 5);
  }

  private findExactMatches(file: ProcessedFile, query: string): SearchMatch[] {
    const matches: SearchMatch[] = [];
    const content = file.content.toLowerCase();
    const originalContent = file.content;

    let startIndex = 0;
    while (true) {
      const index = content.indexOf(query, startIndex);
      if (index === -1) break;

      const snippetStart = Math.max(0, index - 50);
      const snippetEnd = Math.min(content.length, index + query.length + 50);
      const snippet = originalContent.substring(snippetStart, snippetEnd);

      const highlightStart = index - snippetStart;
      const highlightEnd = highlightStart + query.length;
      const beforeHighlight = snippet.substring(0, highlightStart);
      const highlighted = snippet.substring(highlightStart, highlightEnd);
      const afterHighlight = snippet.substring(highlightEnd);

      matches.push({
        snippet: snippet.trim(),
        startIndex: index,
        endIndex: index + query.length,
        highlight: beforeHighlight + '<mark>' + highlighted + '</mark>' + afterHighlight
      });

      startIndex = index + 1;
      if (matches.length >= 3) break;
    }

    return matches;
  }
}