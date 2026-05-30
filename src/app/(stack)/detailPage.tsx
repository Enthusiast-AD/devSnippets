import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { explainSnippet, type AiChatMessage } from '@/lib/aiExplain'
import { exportSnippetToFile } from '@/lib/snippetExport'
import { deleteSnippet, formatSnippetLanguage, getSnippetById, toggleSnippetFavourite } from '@/lib/snippets'
import { ActivityIndicator } from 'react-native'

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return date.toLocaleString()
}

function DetailPage() {
  const params = useLocalSearchParams<{ id?: string | string[] }>()
  const snippetId = Array.isArray(params.id) ? params.id[0] : params.id
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([])
  const [aiInput, setAiInput] = useState('')
  const [aiError, setAiError] = useState('')
  const [snippet, setSnippet] = useState(() => (snippetId ? getSnippetById(snippetId) : null))

  useEffect(() => {
    setSnippet(snippetId ? getSnippetById(snippetId) : null)
  }, [snippetId])

  const handleToggleFavourite = () => {
    if (!snippetId) {
      return
    }

    const updatedSnippet = toggleSnippetFavourite(snippetId)
    setSnippet(updatedSnippet ?? null)
  }

  const handleEdit = () => {
    if (!snippetId) {
      return
    }

    router.push({ pathname: '/createSnippet', params: { id: snippetId } })
  }

  const handleShare = async () => {
    if (!snippet) {
      return
    }

    try {
      await Share.share({
        title: snippet.title,
        message: `${snippet.title}\n${formatSnippetLanguage(snippet.language)}\n\n${snippet.code}`,
      })
    } catch {
      Alert.alert('Share unavailable', 'Your device could not open the share sheet.')
    }
  }

  const handleExport = () => {
    if (!snippet) {
      return
    }

    const exportedFile = exportSnippetToFile(snippet)
    Alert.alert('Snippet exported', `Saved locally to ${exportedFile.name}`)
  }

  const handleExplain = async () => {
    if (!snippet) return

    try {
      const startingPrompt = 'Explain this snippet in a helpful, concise way.'
      setAiError('')
      setAiInput('')
      setAiLoading(true)
      const explanation = await explainSnippet(snippet, {
        prompt: startingPrompt,
      })
      const trimmed = explanation.trim()
      setAiMessages([
        { role: 'user', content: startingPrompt },
        { role: 'assistant', content: trimmed },
      ])
      setAiLoading(false)
    } catch (err: any) {
      setAiLoading(false)
      setAiError(err?.message || String(err))
    }
  }

  const handleFollowUp = async () => {
    if (!snippet || !aiInput.trim()) {
      return
    }

    const nextQuestion = aiInput.trim()
    const nextMessages: AiChatMessage[] = [...aiMessages, { role: 'user', content: nextQuestion }]

    try {
      setAiError('')
      setAiLoading(true)
      setAiInput('')
      setAiMessages(nextMessages)

      const answer = await explainSnippet(snippet, {
        prompt: nextQuestion,
        history: nextMessages,
      })

      setAiMessages([...nextMessages, { role: 'assistant', content: answer.trim() }])
      setAiLoading(false)
    } catch (err: any) {
      setAiLoading(false)
      setAiError(err?.message || String(err))
    }
  }

  const handleDelete = () => {
    if (!snippetId) {
      return
    }

    Alert.alert('Delete snippet?', 'This will permanently remove the snippet from local storage.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteSnippet(snippetId)
          router.replace('/')
        },
      },
    ])
  }

  const codeLines = snippet?.code.split('\n') ?? []
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#F5F7FA" />
        </Pressable>

        <Text style={styles.headerTitle}>Snippet detail</Text>

        <Pressable style={styles.headerButton} onPress={handleToggleFavourite}>
          <Ionicons name={snippet?.isFavourite ? 'star' : 'star-outline'} size={18} color="#A3FF3F" />
        </Pressable>
      </View>

      {!snippet ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Snippet not found</Text>
          <Text style={styles.emptyText}>The selected snippet is unavailable. Go back and open another item.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.heroCard}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{snippet.title}</Text>
              <Ionicons
                name={snippet.isFavourite ? 'star' : 'star-outline'}
                size={20}
                color={snippet.isFavourite ? '#A3FF3F' : '#6B7280'}
              />
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.language}>{formatSnippetLanguage(snippet.language)}</Text>
              <Text style={styles.metaText}>Created {formatDate(snippet.createdAt)}</Text>
              <Text style={styles.metaText}>Updated {formatDate(snippet.updatedAt)}</Text>
            </View>

            {snippet.description ? <Text style={styles.description}>{snippet.description}</Text> : null}

            <View style={styles.tagWrap}>
              {snippet.tags.map((tag) => (
                <Text key={tag} style={styles.tagChip}>
                  {tag}
                </Text>
              ))}
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.secondaryActionButton} onPress={handleEdit}>
                <Ionicons name="create-outline" size={16} color="#A3FF3F" />
                <Text style={styles.secondaryActionText}>Edit</Text>
              </Pressable>

              <Pressable style={styles.secondaryActionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={16} color="#A3FF3F" />
                <Text style={styles.secondaryActionText}>Share</Text>
              </Pressable>

              <Pressable style={styles.secondaryActionButton} onPress={handleExport}>
                <Ionicons name="download-outline" size={16} color="#A3FF3F" />
                <Text style={styles.secondaryActionText}>Export</Text>
              </Pressable>

              <Pressable style={styles.secondaryActionButton} onPress={handleExplain}>
                {aiLoading ? (
                  <ActivityIndicator size="small" color="#A3FF3F" />
                ) : (
                  <Ionicons name="bulb-outline" size={16} color="#A3FF3F" />
                )}
                <Text style={styles.secondaryActionText}>Explain (AI)</Text>
              </Pressable>

              <Pressable style={styles.secondaryActionButton} onPress={handleToggleFavourite}>
                <Ionicons name={snippet.isFavourite ? 'star' : 'star-outline'} size={16} color="#A3FF3F" />
                <Text style={styles.secondaryActionText}>{snippet.isFavourite ? 'Unfavourite' : 'Favourite'}</Text>
              </Pressable>

              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Full code</Text>
              <Text style={styles.sectionMeta}>{codeLines.length} lines</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.codeText}>{snippet.code}</Text>
            </ScrollView>
          </View>

          <View style={[styles.sectionCard, styles.aiCard]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>AI explanation</Text>
                <Text style={styles.aiSubtitle}>A readable breakdown plus follow-up chat inside the same panel.</Text>
              </View>
            </View>

            {aiMessages.length === 0 && !aiError && !aiLoading ? (
              <View style={styles.aiPlaceholder}>
                <Text style={styles.aiPlaceholderTitle}>Tap “Explain (AI)” to generate an explanation.</Text>
                <Text style={styles.aiPlaceholderText}>
                  The result will appear here in a clean, scrollable panel so you can read longer output comfortably.
                </Text>
              </View>
            ) : null}

            {aiError ? <Text style={styles.aiError}>{aiError}</Text> : null}

            <ScrollView
              style={styles.aiThreadScroll}
              contentContainerStyle={styles.aiThreadContent}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {aiMessages.map((message, index) => (
                <View
                  key={`${message.role}-${index}`}
                  style={message.role === 'user' ? styles.aiUserBubble : styles.aiAssistantBubble}
                >
                  <Text style={message.role === 'user' ? styles.aiUserLabel : styles.aiAssistantLabel}>
                    {message.role === 'user' ? 'You' : 'Gemini'}
                  </Text>
                  {message.role === 'assistant' ? (
                    <TextInput
                      style={styles.aiAssistantReply}
                      value={message.content}
                      editable={false}
                      multiline
                      scrollEnabled
                      textAlignVertical="top"
                      showSoftInputOnFocus={false}
                      selectionColor="#A3FF3F"
                    />
                  ) : (
                    <Text style={styles.aiResultText}>{message.content}</Text>
                  )}
                </View>
              ))}

              {aiLoading ? (
                <View style={styles.aiLoadingWrap}>
                  <ActivityIndicator size="small" color="#A3FF3F" />
                  <Text style={styles.aiLoadingText}>Thinking...</Text>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.aiComposer}>
              <TextInput
                style={styles.aiInput}
                placeholder="Ask a follow-up, like 'Can you simplify this?'"
                placeholderTextColor="#6B7280"
                value={aiInput}
                onChangeText={setAiInput}
                multiline
              />

              <Pressable style={styles.aiSendButton} onPress={handleFollowUp} disabled={aiLoading || !aiInput.trim()}>
                <Ionicons name="send-outline" size={16} color={aiLoading || !aiInput.trim() ? '#5B6473' : '#A3FF3F'} />
                <Text style={[styles.aiSendText, (aiLoading || !aiInput.trim()) && styles.aiSendTextDisabled]}>Send</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default DetailPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07070A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10151C',
    borderWidth: 1,
    borderColor: '#1F2430',
  },
  headerTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#0F1117',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1B1F29',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    color: '#F5F7FA',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  metaRow: {
    marginTop: 12,
    gap: 4,
  },
  language: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  description: {
    color: '#E6E6E6',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tagChip: {
    color: '#A3FF3F',
    backgroundColor: '#080909',
    borderWidth: 1,
    borderColor: '#21311F',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 12,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10151C',
    borderWidth: 1,
    borderColor: '#21311F',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryActionText: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1A1212',
    borderWidth: 1,
    borderColor: '#4A2323',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#FF8D8D',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#0F1117',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1B1F29',
  },
  aiCard: {
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionMeta: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  aiSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  aiPlaceholder: {
    backgroundColor: '#0B0E12',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1D2632',
    padding: 14,
  },
  aiPlaceholderTitle: {
    color: '#F5F7FA',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  aiPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },
  aiLoadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  aiLoadingText: {
    color: '#C9D2DD',
    fontSize: 13,
  },
  aiError: {
    color: '#FF8D8D',
    backgroundColor: '#1A1212',
    borderColor: '#4A2323',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    lineHeight: 18,
  },
  aiThreadScroll: {
    maxHeight: 460,
    marginTop: 4,
  },
  aiThreadContent: {
    gap: 10,
    paddingBottom: 8,
  },
  aiResultText: {
    color: '#E6E6E6',
    fontSize: 13,
    lineHeight: 21,
  },
  aiUserBubble: {
    alignSelf: 'flex-end',
    maxWidth: '92%',
    backgroundColor: '#111A11',
    borderColor: '#21311F',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  aiAssistantBubble: {
    alignSelf: 'flex-start',
    width: '100%',
    backgroundColor: '#0B0E12',
    borderColor: '#1D2632',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  aiAssistantReply: {
    maxHeight: 420,
    minHeight: 120,
    color: '#E6E6E6',
    fontSize: 13,
    lineHeight: 21,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    marginTop: 0,
  },
  aiUserLabel: {
    color: '#A3FF3F',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  aiAssistantLabel: {
    color: '#8FB1D9',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  aiComposer: {
    marginTop: 12,
    gap: 10,
  },
  aiInput: {
    minHeight: 78,
    borderRadius: 14,
    backgroundColor: '#0B0E12',
    borderWidth: 1,
    borderColor: '#1D2632',
    color: '#F5F7FA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  aiSendButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10151C',
    borderWidth: 1,
    borderColor: '#21311F',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  aiSendText: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '700',
  },
  aiSendTextDisabled: {
    color: '#5B6473',
  },
  codeText: {
    color: '#D8DEE9',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
  },
  emptyState: {
    margin: 16,
    backgroundColor: '#0F1117',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1B1F29',
  },
  emptyTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
  },
})