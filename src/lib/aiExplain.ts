export type AiChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type ExplainSnippetOptions = {
  prompt?: string
  history?: AiChatMessage[]
}

async function safeJson(resp: Response) {
  try {
    return await resp.json()
  } catch (err) {
    return null
  }
}

function buildPrompt(snippet: any, options?: ExplainSnippetOptions) {
  const parts = []
  parts.push(`Title: ${snippet.title || 'Untitled'}`)
  if (snippet.language) parts.push(`Language: ${snippet.language}`)
  if (snippet.description) parts.push(`Description: ${snippet.description}`)
  if (snippet.tags && snippet.tags.length) parts.push(`Tags: ${snippet.tags.join(', ')}`)
  parts.push('Code:')
  parts.push(snippet.code || '')

  if (options?.history?.length) {
    parts.push('\nConversation so far:')
    options.history.forEach((message) => {
      parts.push(`${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content}`)
    })
  }

  const baseInstructions = options?.prompt
    ? `\nFollow-up request: ${options.prompt}`
    : '\nInstructions: Provide a concise, human-friendly explanation of the code above.'

  parts.push(
    `${baseInstructions}\n- Explain what the code does at a high level.\n- Point out important implementation details or potential pitfalls.\n- Suggest simple improvements or alternatives when relevant.\n- Answer the user's follow-up question directly if one was asked.\n- Keep the response under 800 words and use clear bullet points where helpful.`
  )

  return parts.join('\n')
}

export async function explainSnippet(snippet: any, options?: ExplainSnippetOptions): Promise<string> {
  const API_KEY =
    process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    (globalThis as any).GEMINI_API_KEY
  const MODEL =
    process.env.EXPO_PUBLIC_GEMINI_MODEL ||
    process.env.GEMINI_MODEL ||
    (globalThis as any).GEMINI_MODEL ||
    'gemini-1.5-flash'
  const API_URL =
    process.env.EXPO_PUBLIC_GEMINI_API_URL ||
    process.env.GEMINI_API_URL ||
    (globalThis as any).GEMINI_API_URL ||
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

  if (!API_URL || !API_KEY) {
    throw new Error('Missing Gemini environment variables')
  }

  const prompt = buildPrompt(snippet, options)

  const isGemini = API_URL.includes('generativelanguage.googleapis.com') || API_URL.includes('googleapis.com')

  const body = isGemini
    ? {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        },
      }
    : { prompt }

  const requestUrl = isGemini && !API_URL.includes('?key=') ? `${API_URL}?key=${encodeURIComponent(API_KEY)}` : API_URL

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (!isGemini) {
    headers.Authorization = `Bearer ${API_KEY}`
  }

  const resp = await fetch(requestUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const data = await safeJson(resp)

  if (!resp.ok) {
    const message = data?.error?.message || data?.error || `Request failed with status ${resp.status}`
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message))
  }

  const googleText =
    data?.candidates?.[0]?.content?.parts
      ?.map((part: any) => part?.text)
      .filter(Boolean)
      .join('') || data?.candidates?.[0]?.content?.text
  const openAiText = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text
  const genericText = data?.text ?? data?.result?.content

  const explanation = openAiText || googleText || genericText || (data ? JSON.stringify(data) : '')

  return explanation
}

export default explainSnippet
