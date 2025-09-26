import { FeatureCards } from "@/components/server/FeatureCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Upload } from "lucide-react";
import { FileUpload } from "../client/FileUpload";
import { FileData } from "./FileDetails";
import { Navbar } from "./Navbar";

interface HomePageProps {
  supportedTypes: string[];
  initialFiles: FileData[];
}

export function HomePage({ supportedTypes }: HomePageProps) {
  return (
    <>
      <div className="mb-8">
        <Navbar />
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Your Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload maxFiles={10} acceptedTypes={supportedTypes} />
            </CardContent>
          </Card>

          <FeatureCards />
        </div>
      </div>
    </>
  );
}
