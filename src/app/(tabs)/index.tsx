import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { formatSnippetLanguage, getSnippets, matchesSnippetSearch } from '@/lib/snippets'

function Index() {
  const [searchText, setSearchText] = useState('')
  const snippets = getSnippets()

  const filteredSnippets = snippets.filter((snippet) => matchesSnippetSearch(snippet, searchText))

  const header = (
      <>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Dev<Text style={styles.titleAccent}>Snippets</Text></Text>
            <Text style={styles.subtitle}>A tiny library of useful code bits</Text>
          </View>
          <Ionicons name="sparkles-outline" size={28} color="#A3FF3F" />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder='Search snippets, tags, language..'
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            accessibilityLabel="Search snippets"
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsRow}>
          <Pressable style={styles.actionCard} onPress={() => router.push('/createSnippet')}>
            <Ionicons name="create-outline" size={22} color="#A3FF3F" />
            <Text style={styles.actionLabel}>New Snippet</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => router.push('/aiExplain')}>
            <Ionicons name="flash-outline" size={22} color="#A3FF3F" />
            <Text style={styles.actionLabel}>AI Explain</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => router.push('/files')}>
            <Ionicons name="folder" size={22} color="#FFB84D" />
            <Text style={styles.actionLabel}>File Manager</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Recent Snippets</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
      </>
    )

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={filteredSnippets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable style={styles.card} onPress={() => router.push({ pathname: '/detailPage', params: { id: item.id } })}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Ionicons
                    name={item.isFavourite ? 'star' : 'star-outline'}
                    size={20}
                    color={item.isFavourite ? '#A3FF3F' : '#6B7280'}
                  />
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.languagePill}>{formatSnippetLanguage(item.language)}</Text>
                  {item.description ? <Text style={styles.previewText}>{item.description}</Text> : null}
                </View>

                <View style={styles.tagsRow}>
                  {item.tags.map((tag) => (
                    <Text key={tag} style={styles.tag}>
                      {tag}
                    </Text>
                  ))}
                </View>
              </Pressable>
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No snippets yet</Text>
              <Text style={styles.emptyText}>Create your first snippet and it will be stored locally on this device.</Text>
            </View>
          }
          ListHeaderComponent={header}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07070A',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: '#F5F7FA',
    fontSize: 22,
    fontWeight: '700',
  },
  titleAccent: {
    color: '#A3FF3F',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0F1117',
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#E6E6E6',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  actionsRow: {
    marginBottom: 18,
  },
  actionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#0F1117',
    borderRadius: 10,
    marginRight: 10,
    minWidth: 100,
  },
  actionLabel: {
    color: '#F5F7FA',
    marginTop: 8,
    fontSize: 13,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  viewAll: {
    color: '#A3FF3F',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#0F1117',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#F5F7FA',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  metaRow: {
    marginTop: 10,
    gap: 8,
  },
  languagePill: {
    color: '#A3FF3F',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  previewText: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tag: {
    color: '#A3FF3F',
    fontSize: 12,
    backgroundColor: '#080909',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  emptyState: {
    backgroundColor: '#0F1117',
    borderRadius: 12,
    padding: 18,
    marginTop: 8,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#F5F7FA',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
  },
})