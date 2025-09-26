"use client";

import { useState, useCallback } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface UploadState {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export function FileUpload({
  maxFiles = 10,
  acceptedTypes,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStates, setUploadStates] = useState<UploadState[]>([]);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    [setIsDragOver]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    },
    [setIsDragOver]
  );

  const validateFile = useCallback(
    (file: File): string | null => {
      if (acceptedTypes && !acceptedTypes.includes(file.type)) {
        return `File type ${file.type} is not supported`;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        return "File size must be less than 10MB";
      }
      return null;
    },
    [acceptedTypes]
  );

  const uploadFiles = useCallback(async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setUploadStates((prev) =>
      prev.map((state) =>
        files.includes(state.file)
          ? { ...state, status: "uploading" as const }
          : state
      )
    );

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      await response.json();

      setUploadStates((prev) =>
        prev.map((state) =>
          files.includes(state.file)
            ? { ...state, status: "success" as const, progress: 100 }
            : state
        )
      );

      setTimeout(() => (window.location.href = "/search"), 1500);
    } catch (error) {
      setUploadStates((prev) =>
        prev.map((state) =>
          files.includes(state.file)
            ? {
                ...state,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : state
        )
      );
    }
  }, []);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (uploadStates.length + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles: File[] = [];
      const newStates: UploadState[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          newStates.push({
            file,
            status: "error",
            progress: 0,
            error,
          });
        } else {
          validFiles.push(file);
          newStates.push({
            file,
            status: "pending",
            progress: 0,
          });
        }
      }

      setUploadStates((prev) => [...prev, ...newStates]);

      if (validFiles.length > 0) {
        await uploadFiles(validFiles);
      }
    },
    [maxFiles, uploadStates, uploadFiles, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadStates((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors duration-200",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum {maxFiles} files, 10MB each
            </p>
          </div>
          <Button asChild>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept={acceptedTypes?.join(",")}
                onChange={handleFileSelect}
                className="sr-only"
              />
              Browse Files
            </label>
          </Button>
        </CardContent>
      </Card>

      {uploadStates.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Upload Progress</h3>
          <div className="space-y-2">
            {uploadStates.map((state, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {state.file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">
                        {(state.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      <Badge
                        variant={
                          state.status === "success"
                            ? "default"
                            : state.status === "error"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {state.status}
                      </Badge>
                    </div>
                    {state.error && (
                      <p className="text-xs text-destructive mt-1">
                        {state.error}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {state.status === "success" && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {state.status === "error" && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
