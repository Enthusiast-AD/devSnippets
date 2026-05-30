import 'expo-sqlite/localStorage/install'

export type Snippet = {
  id: string
  title: string
  language: string
  description: string
  code: string
  tags: string[]
  isFavourite: boolean
  createdAt: string
  updatedAt: string
}

export type SnippetInput = {
  title: string
  language: string
  description: string
  code: string
  tags: string[]
  isFavourite?: boolean
}

const STORAGE_KEY = 'devsnippets:snippets'

const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: 'seed-1',
    title: 'React UseEffect Cleanup',
    language: 'javascript',
    description: 'Clears an interval when the component unmounts.',
    code: `useEffect(() => {
  const timer = setInterval(() => {
    console.log('running')
  }, 1000)

  return () => clearInterval(timer)
}, [])`,
    tags: ['javascript', 'react'],
    isFavourite: false,
    createdAt: '2026-05-30T08:00:00.000Z',
    updatedAt: '2026-05-30T08:00:00.000Z',
  },
  {
    id: 'seed-2',
    title: 'Async Storage Setup',
    language: 'typescript',
    description: 'Persists a value locally with async storage semantics.',
    code: `import Storage from 'expo-sqlite/kv-store'

const saveValue = async (value: string) => {
  await Storage.setItem('my-key', value)
}

const getValue = async () => {
  const value = await Storage.getItem('my-key')
  return value
}`,
    tags: ['react-native', 'storage'],
    isFavourite: true,
    createdAt: '2026-05-30T09:00:00.000Z',
    updatedAt: '2026-05-30T09:00:00.000Z',
  },
  {
    id: 'seed-3',
    title: 'FlatList Render Item',
    language: 'javascript',
    description: 'A simple pattern for rendering list rows.',
    code: `<FlatList
  data={data}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  )}
/>`,
    tags: ['react-native', 'ui'],
    isFavourite: false,
    createdAt: '2026-05-30T10:00:00.000Z',
    updatedAt: '2026-05-30T10:00:00.000Z',
  },
  {
    id: 'seed-4',
    title: 'Search Input Debounce',
    language: 'typescript',
    description: 'Debounces a search value before logging it.',
    code: `useEffect(() => {
  const timeout = setTimeout(() => {
    console.log(searchText)
  }, 500)

  return () => clearTimeout(timeout)
}, [searchText])`,
    tags: ['hooks', 'performance'],
    isFavourite: false,
    createdAt: '2026-05-30T11:00:00.000Z',
    updatedAt: '2026-05-30T11:00:00.000Z',
  },
]

function getStorage() {
  if (typeof globalThis.localStorage === 'undefined') {
    return null
  }

  return globalThis.localStorage
}

function cloneDefaultSnippets() {
  return DEFAULT_SNIPPETS.map((snippet) => ({
    ...snippet,
    tags: [...snippet.tags],
  }))
}

function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
    )
  )
}

function normalizeSnippet(snippet: Partial<Snippet>): Snippet {
  const now = new Date().toISOString()

  return {
    id: String(snippet.id ?? `snippet-${now}`),
    title: (snippet.title ?? '').trim() || 'Untitled snippet',
    language: (snippet.language ?? '').trim().toLowerCase() || 'plaintext',
    description: (snippet.description ?? '').trim(),
    code: (snippet.code ?? '').trimEnd(),
    tags: normalizeTags(snippet.tags ?? []),
    isFavourite: Boolean(snippet.isFavourite),
    createdAt: snippet.createdAt ?? now,
    updatedAt: snippet.updatedAt ?? now,
  }
}

function persistSnippets(snippets: Snippet[]) {
  const storage = getStorage()

  if (!storage) {
    return
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}

function readRawSnippets() {
  const storage = getStorage()

  if (!storage) {
    return cloneDefaultSnippets()
  }

  try {
    const storedSnippets = storage.getItem(STORAGE_KEY)

    if (!storedSnippets) {
      const seededSnippets = cloneDefaultSnippets()
      persistSnippets(seededSnippets)
      return seededSnippets
    }

    const parsed = JSON.parse(storedSnippets)

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid snippet storage payload')
    }

    return parsed.map((snippet) => normalizeSnippet(snippet))
  } catch {
    const seededSnippets = cloneDefaultSnippets()
    persistSnippets(seededSnippets)
    return seededSnippets
  }
}

function sortSnippets(snippets: Snippet[]) {
  return [...snippets].sort((left, right) => {
    const rightUpdated = new Date(right.updatedAt).getTime()
    const leftUpdated = new Date(left.updatedAt).getTime()

    if (rightUpdated !== leftUpdated) {
      return rightUpdated - leftUpdated
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  })
}

export function getSnippets() {
  return sortSnippets(readRawSnippets())
}

export function getSnippetById(id: string) {
  return getSnippets().find((snippet) => snippet.id === id) ?? null
}

export function saveSnippet(input: SnippetInput) {
  const now = new Date().toISOString()
  const snippet = normalizeSnippet({
    id: `snippet-${Date.now()}`,
    title: input.title,
    language: input.language,
    description: input.description,
    code: input.code,
    tags: input.tags,
    isFavourite: input.isFavourite ?? false,
    createdAt: now,
    updatedAt: now,
  })

  const snippets = sortSnippets([snippet, ...readRawSnippets()])
  persistSnippets(snippets)

  return snippet
}

export function updateSnippet(id: string, input: SnippetInput) {
  const existingSnippets = readRawSnippets()
  const now = new Date().toISOString()
  const updatedSnippets = existingSnippets.map((snippet) => {
    if (snippet.id !== id) {
      return snippet
    }

    return normalizeSnippet({
      ...snippet,
      title: input.title,
      language: input.language,
      description: input.description,
      code: input.code,
      tags: input.tags,
      isFavourite: input.isFavourite ?? snippet.isFavourite,
      updatedAt: now,
    })
  })

  persistSnippets(sortSnippets(updatedSnippets))

  return getSnippetById(id)
}

export function deleteSnippet(id: string) {
  const remainingSnippets = readRawSnippets().filter((snippet) => snippet.id !== id)
  persistSnippets(sortSnippets(remainingSnippets))
}

export function toggleSnippetFavourite(id: string) {
  const existingSnippets = readRawSnippets()
  const now = new Date().toISOString()
  const updatedSnippets = existingSnippets.map((snippet) => {
    if (snippet.id !== id) {
      return snippet
    }

    return {
      ...snippet,
      isFavourite: !snippet.isFavourite,
      updatedAt: now,
    }
  })

  persistSnippets(sortSnippets(updatedSnippets.map((snippet) => normalizeSnippet(snippet))))

  return getSnippetById(id)
}

export function getFavouriteSnippets() {
  return getSnippets().filter((snippet) => snippet.isFavourite)
}

export function matchesSnippetSearch(snippet: Snippet, searchText: string) {
  const trimmedSearchText = searchText.trim().toLowerCase()

  if (!trimmedSearchText) {
    return true
  }

  const searchableText = [snippet.title, snippet.language, snippet.description, snippet.code, ...snippet.tags]
    .join(' ')
    .toLowerCase()

  return searchableText.includes(trimmedSearchText)
}

export function formatSnippetLanguage(language: string) {
  const trimmedLanguage = language.trim()

  if (!trimmedLanguage) {
    return 'Plain text'
  }

  return trimmedLanguage.charAt(0).toUpperCase() + trimmedLanguage.slice(1)
}