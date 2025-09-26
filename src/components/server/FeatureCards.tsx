import { FileText, Search, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function FeatureCards() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Supported Formats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground">
          <p>• PDF documents</p>
          <p>• Word files (.doc, .docx)</p>
          <p>• Text files (.txt, .md)</p>
          <p>• Web files (.html, .css, .js)</p>
          <p>• Data files (.json, .csv)</p>
        </div>
      </CardContent>
    </Card>
  );
}
