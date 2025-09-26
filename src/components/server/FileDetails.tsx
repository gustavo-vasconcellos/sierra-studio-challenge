import { FileActions } from "@/components/client/FileActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export interface FileData {
  id: string;
  filename: string;
  type: string;
  size: number;
  uploadedAt: string;
}

interface FileDetailsProps {
  file: FileData;
  matches?: Array<{
    snippet: string;
    highlight: string;
  }>;
}

export function FileDetails({ file, matches = [] }: FileDetailsProps) {
  const getFileTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      "application/pdf": "PDF",
      "application/msword": "DOC",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
      "text/plain": "TXT",
      "text/markdown": "MD",
      "text/html": "HTML",
      "application/json": "JSON",
      "text/csv": "CSV",
      "text/javascript": "JS",
      "text/typescript": "TS",
      "text/css": "CSS",
    };
    return typeMap[type] || type.split("/")[1]?.toUpperCase() || "FILE";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{file.filename}</CardTitle>
          <FileActions fileId={file.id} onDelete={() => window.location.reload()} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">File Type</p>
              <p className="text-muted-foreground">
                {getFileTypeDisplay(file.type)}
              </p>
            </div>
            <div>
              <p className="font-medium">File Size</p>
              <p className="text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <div>
              <p className="font-medium">Uploaded</p>
              <p className="text-muted-foreground">
                {formatDate(file.uploadedAt)}
              </p>
            </div>
          </div>

          {matches.length > 0 && (
            <div>
              <p className="font-medium mb-2">All Matches ({matches.length})</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="text-sm bg-muted p-3 rounded"
                    dangerouslySetInnerHTML={{ __html: match.highlight }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
