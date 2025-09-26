import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Search } from "lucide-react";
import { SearchForm } from "../client/SearchForm";
import { FileData } from "./FileDetails";
import { Navbar } from "./Navbar";

interface SearchPageProps {
  supportedTypes: string[];
  initialFiles: FileData[];
}

export function SearchPage({ initialFiles }: SearchPageProps) {
  return (
    <>
      <div className="mb-8">
        <Navbar />
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex pointer items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Your Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchForm initialFiles={initialFiles} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
