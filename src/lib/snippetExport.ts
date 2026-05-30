import { Directory, File } from 'expo-file-system'

import { ensureWorkspace, getFolderByName } from '@/lib/fileManager'
import { getSnippets, type Snippet } from '@/lib/snippets'

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function uniqueExportName(destination: Directory, baseName: string) {
  const existingNames = new Set(destination.list().map((entry) => entry.name))
  const lastDotIndex = baseName.lastIndexOf('.')
  const stem = lastDotIndex > 0 ? baseName.slice(0, lastDotIndex) : baseName
  const extension = lastDotIndex > 0 ? baseName.slice(lastDotIndex) : ''
  let candidate = `${stem}${extension}`
  let counter = 1

  while (existingNames.has(candidate)) {
    candidate = `${stem}-${counter}${extension}`
    counter += 1
  }

  return candidate
}

function buildSnippetExportContent(snippet: Snippet) {
  return [
    `Title: ${snippet.title}`,
    `Language: ${snippet.language}`,
    `Favourite: ${snippet.isFavourite ? 'Yes' : 'No'}`,
    `Tags: ${snippet.tags.join(', ') || 'None'}`,
    `Created: ${snippet.createdAt}`,
    `Updated: ${snippet.updatedAt}`,
    '',
    snippet.description ? `Description: ${snippet.description}` : null,
    snippet.description ? '' : null,
    'Code:',
    snippet.code,
    '',
  ]
    .filter((line): line is string => line !== null)
    .join('\n')
}

export function exportSnippetToFile(snippet: Snippet) {
  ensureWorkspace()

  const exportsFolder = getFolderByName('Exports')
  const fileName = uniqueExportName(exportsFolder, `${slugify(snippet.title) || 'snippet'}-${snippet.id}.txt`)
  const file = new File(exportsFolder, fileName)

  file.write(buildSnippetExportContent(snippet))

  return file
}

export function exportAllSnippetsToFile() {
  ensureWorkspace()

  const exportsFolder = getFolderByName('Exports')
  const snippets = getSnippets()
  const fileName = uniqueExportName(exportsFolder, `devsnippets-export-${Date.now()}.json`)
  const file = new File(exportsFolder, fileName)

  file.write(JSON.stringify(snippets, null, 2))

  return file
}