import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { formatSnippetLanguage, getFavouriteSnippets, matchesSnippetSearch } from '@/lib/snippets'

function Favourites() {
  const [searchText, setSearchText] = useState('')
  const favourites = getFavouriteSnippets()

  const filteredFavourites = favourites.filter((snippet) => matchesSnippetSearch(snippet, searchText))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favourites</Text>
        <Text style={styles.subtitle}>Saved snippets and quick references</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          placeholder="Search snippets, tags, language.."
          placeholderTextColor="#bdbaba"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredFavourites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="heart-dislike-outline" size={32} color="#6B7280" />
            <Text style={styles.emptyTitle}>No favourites found</Text>
            <Text style={styles.emptyText}>Favourite snippets from the detail page to see them here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push({ pathname: '/detailPage', params: { id: item.id } })}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeading}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.languageText}>{formatSnippetLanguage(item.language)}</Text>
              </View>

              <Ionicons name="star" size={18} color="#A3FF3F" />
            </View>

            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}

            <View style={styles.tagRow}>
              {item.tags.map((tag) => (
                <Text key={tag} style={styles.tagChip}>
                  {tag}
                </Text>
              ))}
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
}

export default Favourites

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07070A',
    padding: 16,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    color: '#F5F7FA',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    borderRadius: 14,
    backgroundColor: '#161A22',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#ccc9c9',
    fontSize: 14,
    backgroundColor: '#161A22',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#161A22',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#22262f',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardHeading: {
    flex: 1,
  },
  cardTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  languageText: {
    color: '#A3FF3F',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  description: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    color: '#A3FF3F',
    fontSize: 12,
    backgroundColor: '#0F1117',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
  },
})