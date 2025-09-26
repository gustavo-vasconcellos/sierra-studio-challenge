import { FileText } from 'lucide-react'

export function PageHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-primary mr-2" />
        <h1 className="text-4xl font-bold">File Search App</h1>
      </div>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Upload your documents and search through their content with powerful
        full-text search capabilities
      </p>
    </div>
  )
}