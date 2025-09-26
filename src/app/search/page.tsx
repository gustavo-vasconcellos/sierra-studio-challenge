import { PageHeader } from '@/components/server/PageHeader'
import { SearchPage } from '@/components/server/SearchPage'
import { getFiles } from '@/lib/server-actions'

export default async function Home() {
  const supportedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'text/html',
    'application/json',
    'text/csv',
    'text/javascript',
    'text/typescript',
    'text/css',
    'text/xml',
  ]

  const initialFiles = await getFiles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <PageHeader />
        <SearchPage supportedTypes={supportedTypes} initialFiles={initialFiles} />
      </div>
    </div>
  )
}
