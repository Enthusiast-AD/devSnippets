import { Directory, File, Paths } from 'expo-file-system'

export const WORKSPACE_DIRECTORY = new Directory(Paths.document, 'DevSnippets')
export const WORKSPACE_FOLDER_NAMES = ['Screenshots', 'Code Files', 'Templates', 'Resources', 'Exports'] as const

export type ManagedEntry = {
  item: File | Directory
  kind: 'file' | 'folder'
  name: string
  sizeLabel: string
  modifiedLabel: string
}

export type ClipboardEntry = {
  item: File
  operation: 'copy' | 'move'
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** unitIndex

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

function formatTimestamp(value: number | null | undefined) {
  if (!value) {
    return 'Unknown'
  }

  return new Date(value).toLocaleDateString()
}

function getExistingNames(directory: Directory) {
  return new Set(directory.list().map((entry) => entry.name))
}

function getUniqueFileName(directory: Directory, fileName: string) {
  const existingNames = getExistingNames(directory)
  const parsed = Paths.parse(fileName)
  let candidate = fileName
  let counter = 1

  while (existingNames.has(candidate)) {
    candidate = parsed.ext ? `${parsed.name}-${counter}${parsed.ext}` : `${parsed.name}-${counter}`
    counter += 1
  }

  return candidate
}

function createSeedFile(directory: Directory, fileName: string, content: string) {
  const safeName = getUniqueFileName(directory, fileName)
  const file = directory.createFile(safeName, 'text/plain')
  file.write(content)
}

export function ensureWorkspace() {
  WORKSPACE_DIRECTORY.create({ idempotent: true, intermediates: true })

  for (const folderName of WORKSPACE_FOLDER_NAMES) {
    const folder = new Directory(WORKSPACE_DIRECTORY, folderName)
    folder.create({ idempotent: true, intermediates: true })
  }

  const screenshotsFolder = new Directory(WORKSPACE_DIRECTORY, 'Screenshots')
  const codeFilesFolder = new Directory(WORKSPACE_DIRECTORY, 'Code Files')
  const templatesFolder = new Directory(WORKSPACE_DIRECTORY, 'Templates')
  const resourcesFolder = new Directory(WORKSPACE_DIRECTORY, 'Resources')
  const exportsFolder = new Directory(WORKSPACE_DIRECTORY, 'Exports')

  if (screenshotsFolder.list().length === 0) {
    createSeedFile(screenshotsFolder, 'screenshot-placeholder.txt', 'Drop or attach screenshots for a snippet here.')
  }

  if (codeFilesFolder.list().length === 0) {
    createSeedFile(
      codeFilesFolder,
      'snippet-template.js',
      `export function exampleSnippet() {
  return 'Write a reusable snippet here'
}`
    )
  }

  if (templatesFolder.list().length === 0) {
    createSeedFile(
      templatesFolder,
      'snippet-template.json',
      `{
  "title": "New snippet",
  "language": "javascript",
  "tags": ["template"]
}`
    )
  }

  if (resourcesFolder.list().length === 0) {
    createSeedFile(
      resourcesFolder,
      'resource-notes.md',
      '# Resources\n\nKeep reusable notes, references, and snippets here.'
    )
  }

  if (exportsFolder.list().length === 0) {
    createSeedFile(
      exportsFolder,
      'export-guide.txt',
      'Exported snippets are stored locally so they can be shared or copied later.'
    )
  }

  if (!WORKSPACE_DIRECTORY.list().some((entry) => entry.name === 'readme.txt')) {
    createSeedFile(
      WORKSPACE_DIRECTORY,
      'readme.txt',
      'DevSnippets keeps local files organized by snippets, templates, screenshots, resources, and exports.'
    )
  }
}

export function listManagedEntries(directory: Directory): ManagedEntry[] {
  return directory
    .list()
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((item) => ({
      item,
      kind: item instanceof Directory ? 'folder' : 'file',
      name: item.name,
      sizeLabel: formatBytes(item.size ?? 0),
      modifiedLabel: formatTimestamp(item.modificationTime),
    }))
}

export function buildBreadcrumbs(directory: Directory) {
  const breadcrumbs: Directory[] = []
  let current: Directory | null = directory

  while (current) {
    breadcrumbs.unshift(current)

    if (current.uri === WORKSPACE_DIRECTORY.uri) {
      break
    }

    current = current.parentDirectory
  }

  return breadcrumbs
}

export function createManagedFolder(directory: Directory) {
  const folder = new Directory(directory, `folder-${Date.now()}`)
  folder.create({ idempotent: true, intermediates: true })
  return folder
}

export function createManagedCodeFile(directory: Directory) {
  const fileName = getUniqueFileName(directory, `snippet-${Date.now()}.js`)
  const file = directory.createFile(fileName, 'text/javascript')
  file.write(`export const exampleSnippet = () => {
  return 'Local file manager example'
}`)

  return file
}

export function createManagedTemplateFile(directory: Directory) {
  const fileName = getUniqueFileName(directory, `template-${Date.now()}.json`)
  const file = directory.createFile(fileName, 'application/json')
  file.write(`{
  "name": "snippet-template",
  "language": "javascript"
}`)

  return file
}

export function createManagedScreenshotPlaceholder(directory: Directory) {
  const fileName = getUniqueFileName(directory, `screenshot-${Date.now()}.txt`)
  const file = directory.createFile(fileName, 'text/plain')
  file.write('This placeholder represents a screenshot attached to a snippet.')

  return file
}

function getUniqueDestinationFileName(destination: Directory, sourceName: string) {
  return getUniqueFileName(destination, sourceName)
}

export function copyManagedFile(file: File, destination: Directory) {
  const destinationName = getUniqueDestinationFileName(destination, file.name)
  const copiedFile = new File(destination, destinationName)
  file.copy(copiedFile)
  return copiedFile
}

export function moveManagedFile(file: File, destination: Directory) {
  const destinationName = getUniqueDestinationFileName(destination, file.name)
  const movedFile = new File(destination, destinationName)
  file.move(movedFile)
  return movedFile
}

export function deleteManagedEntry(item: File | Directory) {
  item.delete()
}

export function getFolderByName(name: (typeof WORKSPACE_FOLDER_NAMES)[number]) {
  return new Directory(WORKSPACE_DIRECTORY, name)
}

export function formatManagedStorageUsage() {
  const total = Paths.totalDiskSpace ?? 0
  const available = Paths.availableDiskSpace ?? 0
  const used = Math.max(total - available, 0)

  return {
    usedLabel: formatBytes(used),
    totalLabel: formatBytes(total),
    percentUsed: total > 0 ? Math.min((used / total) * 100, 100) : 0,
  }
}