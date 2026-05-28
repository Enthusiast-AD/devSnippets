import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'

const createSnippet = () => {
  const [title, setTitle] = useState('Debounce Function in JavaScript')
  const [language, setLanguage] = useState('JavaScript')
  const [description, setDescription] = useState('What does this snippet do?')

  const tags = ['javascript', 'function', 'performance']

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link  href={"/"} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={20} color="#F5F7FA" />
        </Link>

        <Text style={styles.headerTitle}>Create Snippet</Text>

        <Pressable style={styles.headerButton}>
          <Ionicons name="checkmark" size={20} color="#A3FF3F" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Snippet title"
            placeholderTextColor="#6B7280"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Language</Text>
          <Pressable style={styles.selectInput}>
            <Text style={styles.selectText}>{language}</Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagWrap}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}

            <Pressable style={styles.addTagChip}>
              <Ionicons name="add" size={16} color="#A3FF3F" />
              <Text style={styles.addTagText}>Add Tag</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Code</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>
{`function debounce(func, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`}
            </Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Add Description [optional]</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
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

export default createSnippet

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
    marginBottom: 12,
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
  selectInput: {
    backgroundColor: '#161A22',
    borderWidth: 1,
    borderColor: '#22262f',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: '#F5F7FA',
    fontSize: 14,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  addTagChip: {
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
  addTagText: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '600',
  },
  codeBox: {
    backgroundColor: '#11161D',
    borderWidth: 1,
    borderColor: '#22262f',
    borderRadius: 12,
    padding: 14,
    minHeight: 180,
  },
  codeText: {
    color: '#D8DEE9',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
})