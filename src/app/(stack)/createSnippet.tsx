import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { getSnippetById, saveSnippet, updateSnippet } from '@/lib/snippets'

const LANGUAGE_OPTIONS = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust']

type FormState = {
  title: string
  language: string
  description: string
  code: string
  tags: string[]
}

const EMPTY_FORM: FormState = {
  title: '',
  language: '',
  description: '',
  code: '',
  tags: [],
}

function serializeForm(form: FormState) {
  return JSON.stringify(form)
}

function CreateSnippet() {
  const params = useLocalSearchParams<{ id?: string | string[] }>()
  const snippetId = Array.isArray(params.id) ? params.id[0] : params.id
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [newTag, setNewTag] = useState('')
  const [initialSnapshot, setInitialSnapshot] = useState(serializeForm(EMPTY_FORM))

  useEffect(() => {
    if (!snippetId) {
      setForm(EMPTY_FORM)
      setInitialSnapshot(serializeForm(EMPTY_FORM))
      return
    }

    const existingSnippet = getSnippetById(snippetId)

    if (!existingSnippet) {
      return
    }

    const nextForm: FormState = {
      title: existingSnippet.title,
      language: existingSnippet.language,
      description: existingSnippet.description,
      code: existingSnippet.code,
      tags: existingSnippet.tags,
    }

    setForm(nextForm)
    setInitialSnapshot(serializeForm(nextForm))
  }, [snippetId])

  const isDirty = serializeForm(form) !== initialSnapshot

  const updateField = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }))
  }

  const addTag = () => {
    const normalizedTag = newTag.trim().toLowerCase()

    if (!normalizedTag || form.tags.includes(normalizedTag)) {
      return
    }

    setForm((currentForm) => ({
      ...currentForm,
      tags: [...currentForm.tags, normalizedTag],
    }))
    setNewTag('')
  }

  const removeTag = (tagToRemove: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      tags: currentForm.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSave = () => {
    if (!form.code.trim()) {
      Alert.alert('Missing code', 'Add a code snippet before saving.')
      return
    }

    const savedSnippet = snippetId ? updateSnippet(snippetId, form) : saveSnippet(form)

    if (!savedSnippet) {
      Alert.alert('Save failed', 'Could not save the selected snippet.')
      return
    }

    router.replace({ pathname: '/detailPage', params: { id: savedSnippet.id } })
  }

  const handleBack = () => {
    if (!isDirty) {
      router.back()
      return
    }

    Alert.alert('Discard changes?', 'Your snippet has unsaved changes.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => router.back() },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#F5F7FA" />
        </Pressable>

        <Text style={styles.headerTitle}>{snippetId ? 'Edit Snippet' : 'Create Snippet'}</Text>

        <Pressable style={styles.headerButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color="#A3FF3F" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder="Snippet title"
            placeholderTextColor="#6B7280"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Language</Text>
          <TextInput
            value={form.language}
            onChangeText={(value) => updateField('language', value)}
            placeholder="JavaScript"
            placeholderTextColor="#6B7280"
            style={styles.input}
          />

          <View style={styles.quickLanguageWrap}>
            {LANGUAGE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={[styles.quickLanguageChip, form.language === option && styles.quickLanguageChipActive]}
                onPress={() => updateField('language', option)}
              >
                <Text style={[styles.quickLanguageText, form.language === option && styles.quickLanguageTextActive]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputRow}>
            <TextInput
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add a tag"
              placeholderTextColor="#6B7280"
              style={[styles.input, styles.tagInput]}
              returnKeyType="done"
              onSubmitEditing={addTag}
            />

            <Pressable style={styles.addTagButton} onPress={addTag}>
              <Ionicons name="add" size={16} color="#A3FF3F" />
              <Text style={styles.addTagButtonText}>Add</Text>
            </Pressable>
          </View>

          <View style={styles.tagWrap}>
            {form.tags.map((tag) => (
              <Pressable key={tag} style={styles.tagChip} onPress={() => removeTag(tag)}>
                <Text style={styles.tagText}>{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Code</Text>
          <TextInput
            value={form.code}
            onChangeText={(value) => updateField('code', value)}
            placeholder="Paste or write your snippet here"
            placeholderTextColor="#6B7280"
            style={[styles.input, styles.codeInput]}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={form.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="What does this snippet do?"
            placeholderTextColor="#6B7280"
            style={[styles.input, styles.descriptionInput]}
            multiline
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateSnippet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    paddingBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#8A909D',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#161A22',
    borderWidth: 1,
    borderColor: '#22262f',
    borderRadius: 12,
    color: '#F5F7FA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  descriptionInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  quickLanguageWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  quickLanguageChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#10151C',
    borderWidth: 1,
    borderColor: '#22262f',
  },
  quickLanguageChipActive: {
    backgroundColor: '#1A2418',
    borderColor: '#294124',
  },
  quickLanguageText: {
    color: '#9AA4B2',
    fontSize: 12,
    fontWeight: '600',
  },
  quickLanguageTextActive: {
    color: '#A3FF3F',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagInput: {
    flex: 1,
  },
  tagChip: {
    backgroundColor: '#21311F',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#294124',
  },
  tagText: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '600',
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10151C',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#22262f',
  },
  addTagButtonText: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '600',
  },
  codeInput: {
    minHeight: 180,
    fontFamily: 'monospace',
  },
})