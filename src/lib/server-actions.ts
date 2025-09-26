import { FileData } from '@/components/server/FileList'

export async function getFiles(): Promise<FileData[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/files`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch files:', error)
  }
  return []
}

export async function searchFiles(query: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search?q=${encodeURIComponent(query)}`,
      { cache: 'no-store' }
    )
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Search failed:', error)
  }
  return []
}