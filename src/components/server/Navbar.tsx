import { Upload, Search } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="flex justify-center space-x-1 bg-muted p-1 rounded-lg w-fit mx-auto">
      <Link href="/">
        <Button variant="outline">
          <Upload className="h-4 w-4" />
          <span>Upload Files</span>
        </Button>
      </Link>
      <Link href="/search">
        <Button variant="outline">
          <Search className="h-4 w-4" />
          <span>Search Files</span>
        </Button>
      </Link>
    </div>
  );
}
