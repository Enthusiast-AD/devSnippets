import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import explainSnippet from '@/lib/aiExplain'
import { formatSnippetLanguage, getSnippets } from '@/lib/snippets'

function AiExplainScreen() {
  const snippets = getSnippets()
  const [selectedId, setSelectedId] = useState<string | null>(snippets[0]?.id ?? null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const selected = snippets.find((s) => s.id === selectedId) || null

  const handleExplain = async () => {
    if (!selected) return

    try {
      setError('')
      setLoading(true)
      const text = await explainSnippet(selected)
      setResult(text.trim())
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      setError(err?.message || String(err))
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F5F7FA" />
        </Pressable>
        <Text style={styles.title}>AI Explain</Text>
      </View>

      <Text style={styles.subtitle}>Choose a snippet to explain</Text>

      <FlatList
        data={snippets}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, item.id === selectedId && styles.cardSelected]}
            onPress={() => setSelectedId(item.id)}
          >
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.lang}>{formatSnippetLanguage(item.language)}</Text>
            </View>
            {item.description ? <Text style={styles.cardDesc}>{item.description}</Text> : null}
          </Pressable>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.actionRow}>
        <Pressable style={styles.explainButton} onPress={handleExplain} disabled={loading || !selected}>
          {loading ? <ActivityIndicator color="#07070A" /> : <Ionicons name="bulb-outline" size={18} color="#07070A" />}
          <Text style={styles.explainText}>{loading ? 'Explaining...' : 'Explain selected'}</Text>
        </Pressable>
        <Pressable style={styles.explainButton} onPress={() => router.push({ pathname: '/createSnippet' })}>
          <Ionicons name="create-outline" size={18} color="#07070A" />
          <Text style={styles.explainText}>New Snippet</Text>
        </Pressable>
      </View>

      <View style={styles.resultWrap}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {result ? (
          <ScrollView style={styles.resultScroll}>
            <TextInput value={result} editable={false} multiline style={styles.resultText} textAlignVertical="top" />
          </ScrollView>
        ) : (
          <Text style={styles.hint}>Explanation will appear here.</Text>
        )}
      </View>
    </SafeAreaView>
  )
}

export default AiExplainScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07070A' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  backButton: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#10151C', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#F5F7FA', fontSize: 18, fontWeight: '800' },
  subtitle: { color: '#9CA3AF', marginLeft: 16, marginBottom: 8 },
  card: { backgroundColor: '#0F1117', marginHorizontal: 16, marginBottom: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1B1F29' },
  cardSelected: { borderColor: '#A3FF3F', borderWidth: 1.5 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#F5F7FA', fontWeight: '800', fontSize: 14 },
  lang: { color: '#A3FF3F', fontSize: 12, fontWeight: '700' },
  cardDesc: { color: '#9CA3AF', marginTop: 8 },
  actionRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 8 },
  explainButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#A3FF3F', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  explainText: { color: '#07070A', fontWeight: '800' },
  resultWrap: { margin: 16, backgroundColor: '#0B0E12', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1D2632', flex: 1 },
  resultScroll: { maxHeight: 360 },
  resultText: { color: '#E6E6E6', fontSize: 13, lineHeight: 20, padding: 0 },
  hint: { color: '#9CA3AF' },
  error: { color: '#FF8D8D' },
})
