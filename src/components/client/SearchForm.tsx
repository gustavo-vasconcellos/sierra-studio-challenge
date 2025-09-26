"use client";

import { FileData, FileDetails } from "@/components/server/FileDetails";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FileText, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchResult {
  file: FileData;
  score: number;
  matches: Array<{
    snippet: string;
    highlight: string;
  }>;
}

interface SearchFormProps {
  initialFiles: FileData[];
}

export function SearchForm({ initialFiles: allFiles }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SearchResult | null>(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        performSearch(query.trim());
      } else {
        setResults([]);
        setSelectedFile(null);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const searchResults = await response.json();
        setResults(searchResults);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: FileData | SearchResult) => {
    if ("score" in file) {
      setSelectedFile(file);
    } else {
      setSelectedFile({ file, score: 0, matches: [] });
    }
  };

  const displayItems = query.trim()
    ? results
    : allFiles.map((file) => ({ file, score: 0, matches: [] }));

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search through your files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Searching...</p>
        </div>
      )}

      {displayItems.length === 0 && !loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {query.trim()
                ? "No files found matching your search."
                : "No files uploaded yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {displayItems.map((result) => (
              <Card
                key={result.file.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedFile?.file.id === result.file.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => handleFileSelect(result)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate">
                        {result.file.filename}
                      </span>
                    </div>
                    {result.score > 0 && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Score: {result.score.toFixed(0)}
                      </span>
                    )}
                  </div>

                  {result.matches.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Matches found:</p>
                      {result.matches.slice(0, 2).map((match, matchIndex) => (
                        <div
                          key={matchIndex}
                          className="text-xs bg-muted p-2 rounded text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: match.highlight }}
                        />
                      ))}
                      {result.matches.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{result.matches.length - 2} more matches
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {selectedFile && (
            <div className="space-y-4">
              <FileDetails
                file={selectedFile.file}
                matches={selectedFile.matches}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
